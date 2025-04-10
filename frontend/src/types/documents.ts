export interface Document {
    id: number,
    user_id: number,
    application: number,
    document_type: string,
    file_name: string,
    file_url: string,
    uploaded_at: string,
}

export interface UploadDocumentRequest {
    //user_id: number,
    application: number,
    document_type: string,
    file_name: string,
    file: File | null,
}