"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { QrCode } from "lucide-react";
import { Modal } from "@/components/ui/modal";

interface QRCodeScannerProps {
  onScan: (data: { zone: string; siteId: string }) => void;
}

export function QRCodeScanner({ onScan }: QRCodeScannerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scanning, setScanning] = useState(false);

  const handleSimulateScan = () => {
    // Simulate QR code scan
    setScanning(true);
    setTimeout(() => {
      onScan({
        zone: "Zone Parking Niveau 2",
        siteId: "SITE-001",
      });
      setScanning(false);
      setIsOpen(false);
    }, 2000);
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="gap-2"
      >
        <QrCode className="h-4 w-4" />
        Scanner QR Code de la zone
      </Button>

      <Modal
        open={isOpen}
        onOpenChange={setIsOpen}
        type="form"
        title="Scanner le QR Code de la zone"
        size="md"
        actions={{
          primary: {
            label: "Simuler scan (démo)",
            onClick: handleSimulateScan,
            disabled: scanning,
          },
          secondary: {
            label: "Annuler",
            onClick: () => setIsOpen(false),
            disabled: scanning,
            variant: "outline",
          },
        }}
      >
        <Card className="border-2 border-dashed">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12">
              {scanning ? (
                <>
                  <div className="h-16 w-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                  <p className="text-sm text-muted-foreground">
                    Scan en cours...
                  </p>
                </>
              ) : (
                <>
                  <QrCode className="h-16 w-16 text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground text-center">
                    Placez le QR code dans le cadre
                  </p>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </Modal>
    </>
  );
}
