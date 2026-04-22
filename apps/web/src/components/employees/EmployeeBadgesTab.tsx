"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { FileSignature, Download, FlipHorizontal } from "lucide-react";
import type { Employee } from "@/lib/types";
import QRCode from "qrcode";
import Image from "next/image";

interface EmployeeBadgesTabProps {
  employee: Employee;
}

export function EmployeeBadgesTab({ employee }: EmployeeBadgesTabProps) {
  const selectedBadgeType = "access";
  const [isFlipped, setIsFlipped] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");

  const generateQRCode = async (data: string) => {
    try {
      const url = await QRCode.toDataURL(data, {
        width: 256,
        margin: 1,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });
      setQrCodeUrl(url);
      return url;
    } catch (err) {
      console.error(err);
      return "";
    }
  };

  // Generate QR code on mount and when employee or badge type changes
  useEffect(() => {
    const generateQR = async () => {
      const qrData = `PRODIGE-${employee.employeeNumber}-${selectedBadgeType}-${employee.id}`;
      await generateQRCode(qrData);
    };
    generateQR();
  }, [employee.id, employee.employeeNumber, selectedBadgeType]);

  const handleDownloadBadge = (badgeType: string) => {
    // In a real app, this would generate and download a PDF badge
    console.log(
      `Downloading ${badgeType} badge for ${employee.firstName} ${employee.lastName}`,
    );
  };

  return (
    <div className="space-y-6">
      {/* Badge Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSignature className="h-5 w-5" />
            Aperçu du badge
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-4">
            {/* Flip Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFlipped(!isFlipped)}
              className="gap-2"
            >
              <FlipHorizontal className="h-4 w-4" />
              {isFlipped ? "Voir recto" : "Voir verso"}
            </Button>

            {/* Badge Card with flip animation */}
            <div
              className="relative w-full max-w-lg"
              style={{ perspective: "1000px" }}
            >
              <div
                className="relative w-full transition-transform duration-500"
                style={{
                  transformStyle: "preserve-3d",
                  transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                }}
              >
                {/* Front Side */}
                <div
                  className="bg-white shadow-xl w-full aspect-[1.586/1] p-0 overflow-hidden border border-gray-200"
                  style={{
                    backfaceVisibility: "hidden",
                  }}
                >
                  {/* Top Section with Logo and Photo */}
                  <div className="flex items-start justify-between p-3 pb-2">
                    {/* Logo Section */}
                    <div className="flex flex-col items-start">
                      <div className="w-20 h-20 mb-1">
                        <div className="relative w-full h-full">
                          {/* Diamond pattern logo placeholder */}
                          <svg viewBox="0 0 100 100" className="w-full h-full">
                            <defs>
                              <pattern
                                id="dots"
                                x="0"
                                y="0"
                                width="20"
                                height="20"
                                patternUnits="userSpaceOnUse"
                              >
                                <circle cx="10" cy="10" r="3" fill="#1e40af" />
                              </pattern>
                            </defs>
                            <polygon
                              points="50,10 90,50 50,90 10,50"
                              fill="url(#dots)"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="text-left">
                        <p className="text-[10px] font-bold uppercase leading-tight text-gray-900">
                          PRODIGE SÉCURITÉ
                        </p>
                        <p className="text-[9px] font-semibold leading-tight text-gray-800">
                          Siège social
                        </p>
                        <p className="text-[8px] leading-tight mt-0.5 text-gray-700">
                          229 Rue Saint-Honoré
                        </p>
                        <p className="text-[8px] leading-tight text-gray-700">
                          75001 PARIS
                        </p>
                      </div>
                    </div>

                    {/* Photo - Square */}
                    <div className="shrink-0">
                      <div className="h-24 w-24 border border-gray-300 overflow-hidden">
                        <Image
                          src={employee.photo || ""}
                          alt={employee.firstName}
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Name and Title */}
                  <div className="px-3 pt-1 pb-2 text-center">
                    <h2 className="text-lg font-bold text-gray-900 leading-tight">
                      {employee.firstName.toUpperCase()}{" "}
                      {employee.lastName.toUpperCase()}
                    </h2>
                    <p className="text-sm font-semibold text-blue-700 mt-0.5">
                      {employee.position}
                    </p>
                  </div>

                  {/* Professional Card Info */}
                  <div className="px-3 pb-2">
                    <h3 className="text-[10px] font-bold mb-1 text-gray-900">
                      Carte professionnelle :
                    </h3>
                    <div className="text-[9px] space-y-0.5 text-gray-900">
                      <div>
                        <span className="font-semibold">Matricule : </span>
                        <span>{employee.employeeNumber}</span>
                      </div>
                      <div>
                        <span className="font-semibold">Né le : </span>
                        <span>
                          {employee.dateOfBirth.toLocaleDateString("fr-FR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold">Carte : </span>
                        <span>
                          CAR-006-2027-06-15-{new Date().getFullYear()}272748
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold">
                          Autorisation administrative :{" "}
                        </span>
                        <span>
                          N°AUT-075-2121-02-14-{new Date().getFullYear()}10715
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Back Side with QR Code */}
                <div
                  className="absolute top-0 left-0 bg-white shadow-xl w-full aspect-[1.586/1] flex flex-col items-center justify-center border border-gray-200"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  <div className="flex flex-col items-center justify-center h-full py-4">
                    <div className="text-center mb-3">
                      <h3 className="text-sm font-bold mb-1 text-gray-900">
                        Code QR de vérification
                      </h3>
                      <p className="text-xs text-gray-700">
                        Badge d&apos;accès
                      </p>
                    </div>

                    <div className="border-2 border-gray-800 p-2 bg-white">
                      {qrCodeUrl ? (
                        <Image
                          src={qrCodeUrl}
                          alt="QR Code"
                          width={144}
                          height={144}
                          className="w-36 h-36"
                        />
                      ) : (
                        <div className="w-36 h-36 bg-gray-200 flex items-center justify-center">
                          <span className="text-xs text-gray-500">
                            Génération...
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="mt-3 text-center">
                      <p className="text-[10px] text-gray-700 font-semibold">
                        Matricule: {employee.employeeNumber}
                      </p>
                      <p className="text-[10px] text-gray-600 mt-1">
                        Valide jusqu&apos;au 31/12/{new Date().getFullYear()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Download Button */}
            <Button
              onClick={() => handleDownloadBadge(selectedBadgeType)}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Télécharger le badge
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
