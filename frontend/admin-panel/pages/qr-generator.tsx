import React, { useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import Input from '@/components/common/Input/Input';
import ActionButton from '@/components/common/ActionButton/ActionButton';
import AlertModal from "@/components/common/AlertModal/AlertModal";
import styles from '@/styles/QrGenerator.module.css';

const QrGenerator = () => {
    const [link, setLink] = useState('');
    const [size, setSize] = useState('300');
    const [bgColor, setBgColor] = useState('#ffffff');
    const [fgColor, setFgColor] = useState('#000000');
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [errorModal, setErrorModal] = useState<{ title: string; message: string } | null>(null);
    const [showQR, setShowQR] = useState(false);

    const validateLink = (value: string) => {
        try {
            new URL(value);
            return true;
        } catch {
            setErrorModal({ title: 'Invalid URL', message: 'Please enter a valid URL starting with http:// or https://' });
            return false;
        }
    };

    const validateSize = (value: string) => {
        const num = Number(value);
        if (!num || num < 50 || num > 1000) {
            setErrorModal({ title: 'Invalid Size', message: 'Size must be a number between 50 and 1000 pixels.' });
            return false;
        }
        return true;
    };

    const handleGenerate = () => {
        if (validateLink(link) && validateSize(size)) {
            setShowQR(true);
        } else {
            setShowQR(false);
        }
    };

    const handleDownload = () => {
        if (!validateLink(link) || !validateSize(size)) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const dataUrl = canvas.toDataURL('image/png');
        const linkElement = document.createElement('a');
        linkElement.href = dataUrl;
        linkElement.download = `qr-code-${new Date().getTime()}.png`;
        document.body.appendChild(linkElement);
        linkElement.click();
        document.body.removeChild(linkElement);
    };

    const isValid = () => {
        try {
            new URL(link);
            const s = Number(size);
            return link !== '' && s >= 50 && s <= 1000;
        } catch {
            return false;
        }
    };

    const resetForm = () => {
        setLink('');
        setSize('300');
        setBgColor('#ffffff');
        setFgColor('#000000');
        setShowQR(false);
        setErrorModal(null);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>QR Code Generator</h1>
                <p className={styles.subtitle}>Create and customize QR codes for any URL</p>
            </div>

            <div className={styles.formWrapper}>
                <div className={styles.formGroup}>
                    <Input
                        label="Enter URL"
                        type="url"
                        value={link}
                        onChange={(e) => {
                            setLink(e.target.value);
                            setShowQR(false);
                        }}
                        placeholder="https://example.com"
                        required
                    />
                </div>

                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <Input
                            label="Size (px)"
                            type="number"
                            value={size}
                            onChange={(e) => {
                                setSize(e.target.value);
                                setShowQR(false);
                            }}
                            placeholder="300"
                            required
                        />
                    </div>

                    <div className={styles.colorPickerGroup}>
                        <div className={styles.colorPicker}>
                            <label>Background</label>
                            <div className={styles.colorInputWrapper}>
                                <input
                                    type="color"
                                    value={bgColor}
                                    onChange={(e) => setBgColor(e.target.value)}
                                    className={styles.colorInput}
                                />
                                <span className={styles.colorValue}>{bgColor}</span>
                            </div>
                        </div>

                        <div className={styles.colorPicker}>
                            <label>Foreground</label>
                            <div className={styles.colorInputWrapper}>
                                <input
                                    type="color"
                                    value={fgColor}
                                    onChange={(e) => setFgColor(e.target.value)}
                                    className={styles.colorInput}
                                />
                                <span className={styles.colorValue}>{fgColor}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.buttonGroup}>
                    <ActionButton
                        onClick={handleGenerate}
                        disabled={!link}
                        className={styles.generateButton}
                    >
                        {showQR ? 'Update QR Code' : 'Generate QR Code'}
                    </ActionButton>

                    <button
                        onClick={resetForm}
                        className={styles.resetButton}
                    >
                        Reset
                    </button>
                </div>
            </div>

            {showQR && (
                <div className={styles.qrWrapper}>
                    <div className={styles.qrContainer}>
                        <QRCodeCanvas
                            ref={canvasRef}
                            value={link}
                            size={Number(size)}
                            bgColor={bgColor}
                            fgColor={fgColor}
                            level="H"
                        />
                    </div>

                    <div className={styles.downloadGroup}>
                        <ActionButton
                            onClick={handleDownload}
                            className={styles.downloadButton}
                            disabled={!isValid()}
                        >
                            Download PNG
                        </ActionButton>
                        <p className={styles.qrInfo}>Scan this QR code to test it</p>
                    </div>
                </div>
            )}

            {errorModal && (
                <AlertModal
                    title={errorModal.title}
                    message={errorModal.message}
                    onConfirm={() => setErrorModal(null)}
                    error
                />
            )}
        </div>
    );
};

export default QrGenerator;