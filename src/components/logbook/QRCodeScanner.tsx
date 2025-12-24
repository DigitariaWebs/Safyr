"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { QrCode } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Scanner le QR Code de la zone</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
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
            <div className="flex gap-2">
              <Button
                onClick={handleSimulateScan}
                disabled={scanning}
                className="flex-1"
              >
                Simuler scan (démo)
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={scanning}
              >
                Annuler
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

