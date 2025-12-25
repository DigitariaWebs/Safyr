"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus } from "lucide-react";
import { mockBankAccounts, BankAccount } from "@/data/banking-accounts";

export default function BankAccountsPage() {
  const [accounts, setAccounts] = useState<BankAccount[]>(mockBankAccounts);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(
    null
  );
  const [formData, setFormData] = useState<Partial<BankAccount>>({});

  const columns: ColumnDef<BankAccount>[] = [
    {
      key: "bankName",
      label: "Banque",
      sortable: true,
    },
    {
      key: "accountNumber",
      label: "Numéro de compte",
    },
    {
      key: "accountType",
      label: "Type",
      render: (account) => (
        <Badge variant="secondary">{account.accountType}</Badge>
      ),
    },
    {
      key: "balance",
      label: "Solde",
      render: (account) => (
        <span className="font-semibold">
          {account.balance.toLocaleString("fr-FR")} {account.currency}
        </span>
      ),
    },
    {
      key: "apiConnected",
      label: "API",
      render: (account) => (
        <Badge variant={account.apiConnected ? "default" : "outline"}>
          {account.apiConnected ? "Connectée" : "Manuelle"}
        </Badge>
      ),
    },
    {
      key: "status",
      label: "Statut",
      render: (account) => (
        <Badge
          variant={
            account.status === "Actif"
              ? "default"
              : account.status === "Suspendu"
                ? "secondary"
                : "outline"
          }
        >
          {account.status}
        </Badge>
      ),
    },
  ];

  const handleCreate = () => {
    setFormData({
      accountType: "Compte courant",
      currency: "EUR",
      status: "Actif",
      apiConnected: false,
      balance: 0,
    });
    setIsCreateModalOpen(true);
  };

  const handleSave = () => {
    if (formData.id) {
      setAccounts(
        accounts.map((a) => (a.id === formData.id ? { ...a, ...formData } : a))
      );
    } else {
      const newAccount: BankAccount = {
        id: (accounts.length + 1).toString(),
        bankName: formData.bankName || "",
        accountNumber: formData.accountNumber || "",
        iban: formData.iban || "",
        bic: formData.bic || "",
        accountType: formData.accountType || "Compte courant",
        balance: formData.balance || 0,
        currency: formData.currency || "EUR",
        status: formData.status || "Actif",
        lastSync: new Date().toISOString(),
        apiConnected: formData.apiConnected || false,
      };
      setAccounts([...accounts, newAccount]);
    }
    setIsCreateModalOpen(false);
    setFormData({});
  };

  const handleRowClick = (account: BankAccount) => {
    setSelectedAccount(account);
    setIsViewModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Comptes Bancaires</h1>
          <p className="text-muted-foreground">
            Connexion et gestion des comptes bancaires
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Compte
        </Button>
      </div>

      <DataTable
        data={accounts}
        columns={columns}
        searchKey="bankName"
        searchPlaceholder="Rechercher un compte..."
        onRowClick={handleRowClick}
      />

      {/* Create/Edit Modal */}
      <Modal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        type="form"
        title={formData.id ? "Modifier le compte" : "Nouveau compte bancaire"}
        size="lg"
        actions={{
          primary: {
            label: formData.id ? "Modifier" : "Créer",
            onClick: handleSave,
          },
          secondary: {
            label: "Annuler",
            onClick: () => setIsCreateModalOpen(false),
            variant: "outline",
          },
        }}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="bankName">Nom de la banque</Label>
              <Input
                id="bankName"
                value={formData.bankName || ""}
                onChange={(e) =>
                  setFormData({ ...formData, bankName: e.target.value })
                }
                placeholder="BNP Paribas"
              />
            </div>

            <div>
              <Label htmlFor="accountNumber">Numéro de compte</Label>
              <Input
                id="accountNumber"
                value={formData.accountNumber || ""}
                onChange={(e) =>
                  setFormData({ ...formData, accountNumber: e.target.value })
                }
                placeholder="30004 00001 00000123456 25"
              />
            </div>

            <div>
              <Label htmlFor="accountType">Type de compte</Label>
              <Select
                value={formData.accountType}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    accountType: value as BankAccount["accountType"],
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Compte courant">Compte courant</SelectItem>
                  <SelectItem value="Compte de dépôt">Compte de dépôt</SelectItem>
                  <SelectItem value="Compte de caution">
                    Compte de caution
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2">
              <Label htmlFor="iban">IBAN</Label>
              <Input
                id="iban"
                value={formData.iban || ""}
                onChange={(e) =>
                  setFormData({ ...formData, iban: e.target.value })
                }
                placeholder="FR76 3000 4000 0100 0001 2345 625"
              />
            </div>

            <div>
              <Label htmlFor="bic">BIC / SWIFT</Label>
              <Input
                id="bic"
                value={formData.bic || ""}
                onChange={(e) =>
                  setFormData({ ...formData, bic: e.target.value })
                }
                placeholder="BNPAFRPPXXX"
              />
            </div>

            <div>
              <Label htmlFor="currency">Devise</Label>
              <Input
                id="currency"
                value={formData.currency || ""}
                onChange={(e) =>
                  setFormData({ ...formData, currency: e.target.value })
                }
                placeholder="EUR"
              />
            </div>

            <div>
              <Label htmlFor="balance">Solde initial</Label>
              <Input
                id="balance"
                type="number"
                step="0.01"
                value={formData.balance || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    balance: parseFloat(e.target.value),
                  })
                }
              />
            </div>

            <div>
              <Label htmlFor="status">Statut</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    status: value as BankAccount["status"],
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Actif">Actif</SelectItem>
                  <SelectItem value="Suspendu">Suspendu</SelectItem>
                  <SelectItem value="Inactif">Inactif</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2 flex items-center space-x-2">
              <Checkbox
                id="apiConnected"
                checked={formData.apiConnected}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, apiConnected: checked as boolean })
                }
              />
              <Label
                htmlFor="apiConnected"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Connecté via API bancaire
              </Label>
            </div>
          </div>
        </div>
      </Modal>

      {/* View Modal */}
      <Modal
        open={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
        type="details"
        title="Détails du compte bancaire"
        size="lg"
        actions={{
          secondary: {
            label: "Fermer",
            onClick: () => setIsViewModalOpen(false),
          },
        }}
      >
        {selectedAccount && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label>Banque</Label>
                <p className="text-sm font-medium">{selectedAccount.bankName}</p>
              </div>

              <div>
                <Label>Numéro de compte</Label>
                <p className="text-sm font-medium">
                  {selectedAccount.accountNumber}
                </p>
              </div>

              <div>
                <Label>Type</Label>
                <Badge variant="secondary">{selectedAccount.accountType}</Badge>
              </div>

              <div className="col-span-2">
                <Label>IBAN</Label>
                <p className="text-sm font-medium font-mono">
                  {selectedAccount.iban}
                </p>
              </div>

              <div>
                <Label>BIC / SWIFT</Label>
                <p className="text-sm font-medium font-mono">
                  {selectedAccount.bic}
                </p>
              </div>

              <div>
                <Label>Devise</Label>
                <p className="text-sm font-medium">{selectedAccount.currency}</p>
              </div>

              <div>
                <Label>Solde</Label>
                <p className="text-sm font-semibold">
                  {selectedAccount.balance.toLocaleString("fr-FR")}{" "}
                  {selectedAccount.currency}
                </p>
              </div>

              <div>
                <Label>Statut</Label>
                <Badge
                  variant={
                    selectedAccount.status === "Actif" ? "default" : "outline"
                  }
                >
                  {selectedAccount.status}
                </Badge>
              </div>

              <div>
                <Label>Connexion API</Label>
                <Badge
                  variant={selectedAccount.apiConnected ? "default" : "outline"}
                >
                  {selectedAccount.apiConnected ? "Connectée" : "Manuelle"}
                </Badge>
              </div>

              <div>
                <Label>Dernière synchronisation</Label>
                <p className="text-sm font-medium">
                  {new Date(selectedAccount.lastSync).toLocaleString("fr-FR")}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

