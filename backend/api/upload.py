from fastapi import APIRouter, UploadFile, File, HTTPException

from services.document_service import save_document

router = APIRouter()


@router.post("/upload")
def upload_document(file: UploadFile = File(...)):

    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="No file selected."
        )

    try:

        result = save_document(file)

        return {
            "success": True,
            "filename": result["filename"],
            "chunks": result["chunks"],
            "message": "Document uploaded and learned successfully."
        }

    except ValueError as e:

        print("VALUE ERROR:", e)

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

    except Exception as e:

        print("\n" + "=" * 60)
        print("UPLOAD ERROR")
        print(type(e).__name__)
        print(e)
        print("=" * 60)

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )