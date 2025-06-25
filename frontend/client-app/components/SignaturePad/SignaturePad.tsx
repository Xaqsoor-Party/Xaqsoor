import React, { useRef, useEffect, useCallback } from "react";
import SignatureCanvas from "react-signature-canvas";
import styles from "./SignaturePad.module.css";
import {useLanguage} from "@/context/LanguageContext";
import {getTranslations} from "@/translations";

interface SignaturePadProps {
    onChange: (dataUrl: string) => void;
    initialSignature?: string;
    disabled?: boolean;
}

const SignaturePad: React.FC<SignaturePadProps> = ({ onChange, initialSignature, disabled = false }) => {
    const sigCanvasRef = useRef<SignatureCanvas | null>(null);

    const clearSignature = useCallback(() => {
        if (sigCanvasRef.current) {
            sigCanvasRef.current.clear();
            onChange('');
        }
    }, [onChange]);

    const handleDrawingEnd = useCallback(() => {
        if (sigCanvasRef.current) {
            if (!sigCanvasRef.current.isEmpty()) {
                const dataUrl = sigCanvasRef.current.toDataURL("image/png");
                onChange(dataUrl);
            } else {
                onChange('');
            }
        }
    }, [onChange]);

    useEffect(() => {
        if (sigCanvasRef.current && initialSignature) {
            sigCanvasRef.current.fromDataURL(initialSignature);
        }
    }, [initialSignature]);
    const {language} = useLanguage();
    const t = getTranslations(language, 'founderPages').founderOnboarding.fields.signature;
    return (
        <div className={styles.signaturePadWrapper}>
            <p className={styles.label}>{t.label}:</p>
            <div className={`${styles.signatureContainer} ${disabled ? styles.disabled : ''}`}>
                <SignatureCanvas
                    ref={sigCanvasRef}
                    penColor="black"
                    canvasProps={{
                        className: styles.signatureCanvas,
                    }}
                    backgroundColor="#fff"
                    onEnd={handleDrawingEnd}
                />
            </div>

            <div className={styles.actions}>
                <button
                    type="button"
                    onClick={clearSignature}
                    className={styles.clearButton}
                    disabled={disabled}
                >
                    {t.button}
                </button>
            </div>

            {initialSignature && disabled && (
                <div className={styles.preview}>
                    <p className={styles.previewLabel}>Current Saved Signature:</p>
                    <img src={initialSignature} alt="Saved signature preview" className={styles.previewImage} />
                </div>
            )}
        </div>
    );
};

export default SignaturePad;