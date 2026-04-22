import React, { useEffect, useState } from "react";
import { Pressable, Text, View, StyleSheet, Modal } from "react-native";
import { X } from "lucide-react-native";
import { useTheme } from "@/theme";
import { getBodyFont } from "@/utils/fonts";

let CameraView: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const cameraMod = require("expo-camera");
  CameraView = cameraMod.CameraView;
} catch {
  // expo-camera not available
}

interface PatrolQrScannerProps {
  visible: boolean;
  onScan: (data: string) => void;
  onClose: () => void;
}

export function PatrolQrScanner({
  visible,
  onScan,
  onClose,
}: PatrolQrScannerProps) {
  const { colors } = useTheme();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    if (!visible || !CameraView) return;
    (async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { Camera } = require("expo-camera");
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === "granted");
      } catch {
        setHasPermission(false);
      }
    })();
  }, [visible]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Close button */}
        <Pressable
          onPress={onClose}
          style={[styles.closeBtn, { backgroundColor: `${colors.muted}CC` }]}
        >
          <X size={20} color={colors.foreground} />
        </Pressable>

        {CameraView && hasPermission ? (
          <CameraView
            style={StyleSheet.absoluteFillObject}
            barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
            onBarcodeScanned={({ data }: { data: string }) => {
              onScan(data);
              onClose();
            }}
          />
        ) : (
          <View style={styles.fallback}>
            <Text
              style={{
                fontSize: 14,
                color: colors.mutedForeground,
                fontFamily: getBodyFont("400"),
                textAlign: "center",
                paddingHorizontal: 24,
              }}
            >
              {!CameraView
                ? "Caméra non disponible.\nReconstruisez l'app avec expo-camera."
                : hasPermission === false
                  ? "Permission caméra refusée."
                  : "Chargement de la caméra..."}
            </Text>
          </View>
        )}

        {/* Instruction overlay */}
        <View style={styles.instructionBar}>
          <Text
            style={{
              fontSize: 13,
              fontFamily: getBodyFont("500"),
              color: "#ffffff",
              textAlign: "center",
            }}
          >
            Scanner le QR du point de contrôle
          </Text>
        </View>

        {/* Crosshair overlay */}
        <View style={styles.crosshairContainer} pointerEvents="none">
          <View style={[styles.crosshair, { borderColor: colors.primary }]} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  closeBtn: {
    position: "absolute",
    top: 60,
    right: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  fallback: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  instructionBar: {
    position: "absolute",
    bottom: 80,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  crosshairContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  crosshair: {
    width: 200,
    height: 200,
    borderWidth: 2,
    borderRadius: 16,
  },
});
