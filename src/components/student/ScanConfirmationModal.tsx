"use client";

import React, { useState } from "react";
import { submitCheckInAction } from "@/server-actions/attendance.actions";
import { CheckInResult } from "@/types/attendance.types";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface ScanConfirmationModalProps {
  sessionId: string;
  scannedToken: string;
  onSuccess: (data: CheckInResult) => void;
  onClose: () => void;
}

export function ScanConfirmationModal({
  sessionId,
  scannedToken,
  onSuccess,
  onClose,
}: ScanConfirmationModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleConfirm = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    const res = await submitCheckInAction({
      sessionId,
      token: scannedToken,
    });

    setIsLoading(false);

    if (res.success && res.data) {
      onSuccess(res.data);
    } else {
      setErrorMessage(res.error?.message || "ไม่สามารถบันทึกเวลาได้ กรุณาสแกนรหัสใหม่");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900">
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
          ยืนยันการบันทึกเวลาเรียน
        </h3>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          ระบบได้รับรหัส QR Code เรียบร้อยแล้ว กรุณากดยืนยันเพื่อบันทึกการเข้าเรียน
        </p>

        {errorMessage && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            ยกเลิก
          </Button>
          <Button onClick={handleConfirm} disabled={isLoading} className="bg-amber-600 hover:bg-amber-700 text-white">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                กำลังบันทึก...
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                ยืนยันเช็คชื่อ
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
