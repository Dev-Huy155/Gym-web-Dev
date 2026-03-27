import React, { useEffect, useMemo, useState } from "react";
import { Edit, Plus, Search, Shield, Trash2, UserCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import {
  deleteManagedAccount,
  getAccountTypeLabel,
  getRoleLabel,
  getStoredAccounts,
  saveManagedAccount,
  type AccountRole,
  type AccountStatus,
  type AccountType,
  type StoredAccount,
} from "../../lib/storage";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const DEFAULT_FORM_DATA = {
  username: "",
  fullName: "",
  email: "",
  phone: "",
  password: "",
  accountType: "user" as AccountType,
  role: "member" as AccountRole,
  status: "active" as AccountStatus,
};

const ROLE_OPTIONS: Record<AccountType, AccountRole[]> = {
  admin: ["super_admin", "admin", "manager", "trainer", "staff"],
  user: ["member"],
};

export default function AccountManagement() {
  const [accounts, setAccounts] = useState<StoredAccount[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [accountTypeFilter, setAccountTypeFilter] = useState<"all" | AccountType>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<StoredAccount | null>(null);
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);

  const loadAccounts = () => {
    setAccounts(getStoredAccounts());
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  const filteredAccounts = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    return accounts.filter((account) => {
      const matchesKeyword =
        !keyword ||
        account.username.toLowerCase().includes(keyword) ||
        account.fullName.toLowerCase().includes(keyword) ||
        account.email.toLowerCase().includes(keyword);

      const matchesType =
        accountTypeFilter === "all" || account.accountType === accountTypeFilter;

      return matchesKeyword && matchesType;
    });
  }, [accounts, accountTypeFilter, searchTerm]);

  const handleAdd = () => {
    setEditingAccount(null);
    setFormData(DEFAULT_FORM_DATA);
    setIsDialogOpen(true);
  };

  const handleEdit = (account: StoredAccount) => {
    setEditingAccount(account);
    setFormData({
      username: account.username,
      fullName: account.fullName,
      email: account.email,
      phone: account.phone,
      password: account.password,
      accountType: account.accountType,
      role: account.role,
      status: account.status,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (account: StoredAccount) => {
    if (!window.confirm(`Ban co chac muon xoa tai khoan ${account.username}?`)) return;

    try {
      deleteManagedAccount(account.id);
      loadAccounts();
      alert("Xoa tai khoan thanh cong");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Khong the xoa tai khoan");
    }
  };

  const handleSave = () => {
    if (
      !formData.username.trim() ||
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      !formData.password.trim()
    ) {
      alert("Vui long dien day du thong tin bat buoc");
      return;
    }

    try {
      saveManagedAccount({
        id: editingAccount?.id,
        username: formData.username,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        accountType: formData.accountType,
        role: formData.role,
        status: formData.status,
      });

      loadAccounts();
      setIsDialogOpen(false);
      setEditingAccount(null);
      alert(`${editingAccount ? "Cap nhat" : "Them"} tai khoan thanh cong`);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Khong the luu tai khoan");
    }
  };

  const activeRoleOptions = ROLE_OPTIONS[formData.accountType];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Quản Lý Tài Khoản</h1>
          <p className="text-gray-600">
            Quản trị tài khoản người dùng và tài khoản admin để phân quyền đăng nhập
          </p>
        </div>
        <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Thêm Tài Khoản
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <div className="text-sm text-gray-500">Tổng tài khoản</div>
            <div className="mt-2 text-3xl font-semibold">{accounts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="text-sm text-gray-500">Tài khoản admin</div>
            <div className="mt-2 text-3xl font-semibold text-blue-600">
              {accounts.filter((account) => account.accountType === "admin").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="text-sm text-gray-500">Tài khoản user</div>
            <div className="mt-2 text-3xl font-semibold text-green-600">
              {accounts.filter((account) => account.accountType === "user").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Tìm theo username, họ tên hoặc email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={accountTypeFilter === "all" ? "default" : "outline"}
              onClick={() => setAccountTypeFilter("all")}
            >
              Tất cả
            </Button>
            <Button
              variant={accountTypeFilter === "admin" ? "default" : "outline"}
              onClick={() => setAccountTypeFilter("admin")}
            >
              Admin
            </Button>
            <Button
              variant={accountTypeFilter === "user" ? "default" : "outline"}
              onClick={() => setAccountTypeFilter("user")}
            >
              User
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAccounts.map((account) => (
          <Card key={account.id}>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  {account.accountType === "admin" ? (
                    <Shield className="w-6 h-6" />
                  ) : (
                    <UserCircle className="w-6 h-6" />
                  )}
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">{account.fullName}</CardTitle>
                  <p className="text-sm text-gray-600">@{account.username}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <Badge>{getAccountTypeLabel(account.accountType)}</Badge>
                <Badge variant="outline">{getRoleLabel(account.role)}</Badge>
                <Badge
                  className={
                    account.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }
                >
                  {account.status === "active" ? "Hoạt động" : "Khóa"}
                </Badge>
              </div>

              <div className="text-sm text-gray-600 space-y-1">
                <p>Email: {account.email}</p>
                <p>SĐT: {account.phone || "Chưa cập nhật"}</p>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(account)}
                  className="flex-1"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Sửa
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(account)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingAccount ? "Chỉnh Sửa Tài Khoản" : "Thêm Tài Khoản Mới"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="accountType">Loại tài khoản</Label>
              <Select
                value={formData.accountType}
                onValueChange={(value: AccountType) =>
                  setFormData({
                    ...formData,
                    accountType: value,
                    role: ROLE_OPTIONS[value][0],
                  })
                }
              >
                <SelectTrigger id="accountType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="role">Vai trò</Label>
              <Select
                value={formData.role}
                onValueChange={(value: AccountRole) =>
                  setFormData({ ...formData, role: value })
                }
              >
                <SelectTrigger id="role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {activeRoleOptions.map((role) => (
                    <SelectItem key={role} value={role}>
                      {getRoleLabel(role)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="admin01"
              />
            </div>

            <div>
              <Label htmlFor="fullName">Họ và tên</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Nguyen Van A"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="account@elitefitness.vn"
              />
            </div>

            <div>
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="0901234567"
              />
            </div>

            <div>
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="******"
              />
            </div>

            <div>
              <Label htmlFor="status">Trạng thái</Label>
              <Select
                value={formData.status}
                onValueChange={(value: AccountStatus) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="inactive">Khóa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
              Lưu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
