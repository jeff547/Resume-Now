from datetime import datetime, timedelta, timezone

from azure.storage.blob import BlobSasPermissions, BlobServiceClient, generate_blob_sas

from app.core.config import settings


class ResumeStorage:
    def __init__(self) -> None:
        # Load from environment variables
        self.connect_str = settings.AZURE_STORAGE_CONNECTION_STRING
        if not self.connect_str:
            raise ValueError("AZURE_STORAGE_CONNECTION_STRING is not set")

        self.blob_service_client = BlobServiceClient.from_connection_string(
            self.connect_str
        )

        self.resume_container = "resumes"  # Private Access
        self.thumbnail_container = "thumbnails"  # Blob Access

    def upload_bytes(self, data: bytes, file_name: str, container_name: str):
        """
        Uploads raw bytes to Azure Blob Storage
        """
        blob_client = self.blob_service_client.get_blob_client(
            container=container_name,
            blob=file_name,
        )

        blob_client.upload_blob(data=data, overwrite=True)

        return blob_client

    def get_public_url(self, file_name: str):
        """
        Returns a direct, permanent link
        """

        blob_client = self.blob_service_client.get_blob_client(
            container=self.resume_container, blob=file_name
        )
        return blob_client.url

    def get_sas_url(self, file_name: str):
        """
        Returns a temporary (1 hour) secure link
        """

        blob_client = self.blob_service_client.get_blob_client(
            container=self.thumbnail_container, blob=file_name
        )

        sas_token = generate_blob_sas(
            account_name=blob_client.account_name,  # type: ignore
            container_name=self.thumbnail_container,
            blob_name=file_name,
            account_key=self.blob_service_client.credential.account_key,
            permission=BlobSasPermissions(read=True),
            expiry=datetime.now(timezone.utc) + timedelta(hours=1),
        )

        return f"{blob_client.url}?{sas_token}"

    def delete_file(self, file_name: str, container_name: str):
        """
        Deletes a blob from the specified container
        """
        if not file_name:
            return None

        try:
            blob_client = self.blob_service_client.get_blob_client(
                container=self.thumbnail_container, blob=file_name
            )

            if blob_client.exists:
                blob_client.delete_blob()
        except Exception as e:
            print(f"Warning: Could not delete {file_name} from Azure: {e}")
            return None


def get_storage() -> "ResumeStorage":
    return ResumeStorage()
