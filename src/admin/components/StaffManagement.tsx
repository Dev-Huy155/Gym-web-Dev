import React, { useEffect, useMemo, useState } from "react";
import { Edit, Mail, Phone, Plus, Search, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { getStoredAccounts, saveManagedAccount } from "../../lib/storage";
import { isTrainerPosition, STAFF_POSITION_OPTIONS } from "../../lib/staff";

interface Staff {
  id: number;
  name: string;
  position: string;
  phone: string;
  email: string;
  address: string;
  joinDate: string;
  salary: string;
  status: "Dang lam" | "Nghi phep" | "Da nghi";
}

type StaffFilter = "all" | "trainers" | "staff";

const DEFAULT_FORM_DATA = {
  name: "",
  position: "Huấn luyện viên",
  phone: "",
  email: "",
  address: "",
  joinDate: "",
  salary: "",
  status: "Dang lam" as Staff["status"],
};

const DEFAULT_ACCOUNT_FORM = {
  enabled: true,
  username: "",
  password: "",
};

const normalizeStaffStatus = (value: string | null | undefined): Staff["status"] => {
  const rawValue = value?.trim() || "";
  const normalized = rawValue
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\u0111/g, "d")
    .replace(/\u0110/g, "D")
    .toLowerCase();

  if (normalized === "nghi phep") return "Nghi phep";
  if (normalized === "da nghi") return "Da nghi";
  return "Dang lam";
};

const parseSalaryInput = (value: string) => {
  const digitsOnly = value.replace(/\D/g, "");
  return digitsOnly ? Number(digitsOnly) : 0;
};

const formatSalary = (value: string | number) => {
  const numericValue = typeof value === "number" ? value : parseSalaryInput(String(value));
  return numericValue ? numericValue.toLocaleString("vi-VN") : "";
};

const suggestUsername = (name: string, email: string) => {
  const emailPrefix = email.trim().split("@")[0];
  if (emailPrefix) return emailPrefix.toLowerCase();

  return name
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, ".")
    .replace(/[^a-z0-9.]/g, "");
};

export default function StaffManagement() {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [staffFilter, setStaffFilter] = useState<StaffFilter>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const [accountForm, setAccountForm] = useState(DEFAULT_ACCOUNT_FORM);

  const loadData = () => {
    fetch("http://localhost:3001/staff")
      .then((res) => res.json())
      .then((data) => {
        const formatted = (data || []).map((item: any) => ({
          id: Number(item.id ?? item.ID ?? 0),
          name: String(item.name ?? item.NAME ?? ""),
          position: String(item.position ?? item.POSITION ?? ""),
          phone: String(item.phone ?? item.PHONE ?? ""),
          email: String(item.email ?? item.EMAIL ?? ""),
          address: String(item.address ?? item.ADDRESS ?? ""),
          joinDate: String(item.joinDate ?? item.JOIN_DATE ?? ""),
          salary: String(item.salary ?? item.SALARY ?? 0),
          status: normalizeStaffStatus(item.status ?? item.STATUS),
        }));

        setStaffList(formatted);
      })
      .catch((err) => console.error("Loi fetch staff:", err));
  };

  useEffect(() => {
    loadData();
  }, []);

  const trainerCount = useMemo(
    () => staffList.filter((staff) => isTrainerPosition(staff.position)).length,
    [staffList],
  );

  const employeeCount = staffList.length - trainerCount;

  const filteredStaff = staffList.filter((staff) => {
    const matchesKeyword =
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.position.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesKeyword) return false;
    if (staffFilter === "trainers") return isTrainerPosition(staff.position);
    if (staffFilter === "staff") return !isTrainerPosition(staff.position);
    return true;
  });

  const handleAdd = () => {
    setEditingStaff(null);
    setFormData(DEFAULT_FORM_DATA);
    setAccountForm(DEFAULT_ACCOUNT_FORM);
    setIsDialogOpen(true);
  };

  const handleEdit = (staff: Staff) => {
    const linkedAccount = getStoredAccounts().find(
      (account) =>
        account.accountType === "admin" &&
        account.email.trim().toLowerCase() === staff.email.trim().toLowerCase(),
    );

    setEditingStaff(staff);
    setFormData({
      name: staff.name,
      position: staff.position,
      phone: staff.phone,
      email: staff.email,
      address: staff.address,
      joinDate: staff.joinDate ? staff.joinDate.split("T")[0] : "",
      salary: staff.salary,
      status: staff.status,
    });
    setAccountForm({
      enabled: Boolean(linkedAccount),
      username: linkedAccount?.username || suggestUsername(staff.name, staff.email),
      password: linkedAccount?.password || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Ban co chac muon xoa nhan vien nay?")) return;

    try {
      const response = await fetch(`http://localhost:3001/staff/${id}`, { method: "DELETE" });

      if (response.ok) {
        alert("Xoa nhan vien thanh cong");
        loadData();
      } else {
        const error = await response.json();
        alert("Loi xoa: " + (error.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Khong ket noi server");
    }
  };

  const handleSave = async () => {
    const numericSalary = parseSalaryInput(formData.salary);

    if (
      !formData.name.trim() ||
      !formData.position.trim() ||
      !formData.phone.trim() ||
      !formData.email.trim() ||
      !formData.address.trim() ||
      !formData.joinDate ||
      numericSalary <= 0
    ) {
      alert("Vui long dien day du thong tin bat buoc");
      return;
    }

    if (accountForm.enabled && (!accountForm.username.trim() || !accountForm.password.trim())) {
      alert("Vui long nhap username va mat khau cho tai khoan nhan vien");
      return;
    }

    const url = editingStaff
      ? `http://localhost:3001/staff/${editingStaff.id}`
      : "http://localhost:3001/staff";
    const method = editingStaff ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          salary: numericSalary,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        alert("Loi: " + (result.error || "Unknown error"));
        return;
      }

      if (accountForm.enabled) {
        const linkedAccount = getStoredAccounts().find(
          (account) =>
            account.accountType === "admin" &&
            (account.email.trim().toLowerCase() === formData.email.trim().toLowerCase() ||
              account.email.trim().toLowerCase() === editingStaff?.email.trim().toLowerCase()),
        );

        saveManagedAccount({
          id: linkedAccount?.id,
          username: accountForm.username.trim(),
          fullName: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          password: accountForm.password,
          accountType: "admin",
          role: isTrainerPosition(formData.position) ? "trainer" : "staff",
          status: formData.status === "Da nghi" ? "inactive" : "active",
        });
      }

      alert(`${editingStaff ? "Cap nhat" : "Them"} nhan vien thanh cong`);
      loadData();
      setIsDialogOpen(false);
      setEditingStaff(null);
      setAccountForm(DEFAULT_ACCOUNT_FORM);
    } catch (err) {
      console.error("Save error:", err);
      alert("Khong ket noi server");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Dang lam":
        return "bg-green-100 text-green-800";
      case "Nghi phep":
        return "bg-yellow-100 text-yellow-800";
      case "Da nghi":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getInitials = (name: string) => {
    const words = name.split(" ").filter(Boolean);
    return words[words.length - 1]?.[0] + (words.length > 1 ? words[0][0] : "") || "NV";
  };

  const handleEmailBlur = () => {
    if (!accountForm.enabled || accountForm.username.trim()) return;

    setAccountForm((current) => ({
      ...current,
      username: suggestUsername(formData.name, formData.email),
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Quan Ly Nhan Vien</h1>
          <p className="text-gray-600">
            Tao nhan vien va tao luon tai khoan cho huan luyen vien / nhan vien
          </p>
        </div>
        <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Them Nhan Vien
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <div className="text-sm text-gray-500">Tong nhan su</div>
            <div className="mt-2 text-3xl font-semibold">{staffList.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="text-sm text-gray-500">Huan luyen vien</div>
            <div className="mt-2 text-3xl font-semibold text-red-600">{trainerCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="text-sm text-gray-500">Nhan vien khac</div>
            <div className="mt-2 text-3xl font-semibold text-blue-600">{employeeCount}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Tim kiem nhan vien..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant={staffFilter === "all" ? "default" : "outline"} onClick={() => setStaffFilter("all")}>
              Tat ca
            </Button>
            <Button variant={staffFilter === "trainers" ? "default" : "outline"} onClick={() => setStaffFilter("trainers")}>
              Huan luyen vien
            </Button>
            <Button variant={staffFilter === "staff" ? "default" : "outline"} onClick={() => setStaffFilter("staff")}>
              Nhan vien khac
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredStaff.length === 0 && (
          <Card className="md:col-span-2 lg:col-span-3">
            <CardContent className="p-6 text-sm text-gray-600">
              Khong co du lieu nhan su de hien thi.
            </CardContent>
          </Card>
        )}

        {filteredStaff.map((staff) => (
          <Card key={staff.id}>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    {getInitials(staff.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-lg">{staff.name}</CardTitle>
                  <p className="text-sm text-gray-600">{staff.position}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {isTrainerPosition(staff.position) && (
                    <Badge className="bg-red-100 text-red-700">Trainer</Badge>
                  )}
                  <Badge className={getStatusColor(staff.status)}>{staff.status}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{staff.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="truncate">{staff.email}</span>
                </div>
                <div className="text-sm text-gray-600">Dia chi: {staff.address}</div>
              </div>

              <div className="border-t pt-2 space-y-1 text-sm">
                <p>
                  <span className="text-gray-600">Ngày vào làm:</span>{" "}
                  {staff.joinDate ? staff.joinDate.split("T")[0] : ""}
                </p>
                <p>
                  <span className="text-gray-600">Lương:</span> {formatSalary(staff.salary)} VND
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(staff)} className="flex-1">
                  <Edit className="w-4 h-4 mr-1" />
                  Sửa
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(staff.id)}
                  className="text-red-600 hover:bg-red-50 hover:text-red-700"
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
            <DialogTitle>{editingStaff ? "Chinh Sua Nhan Vien" : "Them Nhan Vien Moi"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Họ và tên</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nguyen Van A"
              />
            </div>

            <div>
              <Label htmlFor="position">Vị trí</Label>
              <Select value={formData.position} onValueChange={(value) => setFormData({ ...formData, position: value })}>
                <SelectTrigger id="position">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STAFF_POSITION_OPTIONS.map((position) => (
                    <SelectItem key={position} value={position}>
                      {position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="phone">So dien thoai</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="0901234567"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onBlur={handleEmailBlur}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@elitefitness.vn"
              />
            </div>

            <div>
              <Label htmlFor="address">Địa chỉ</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="123 Xuan Dieu, Tay Ho, Ha Noi"
              />
            </div>

            <div>
              <Label htmlFor="joinDate">Ngày vào làm</Label>
              <Input
                id="joinDate"
                type="date"
                value={formData.joinDate}
                onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="salary">Lương (VND)</Label>
              <Input
                id="salary"
                inputMode="numeric"
                value={formatSalary(formData.salary)}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                placeholder="10.000.000"
              />
            </div>

            <div>
              <Label htmlFor="status">Trang thai</Label>
              <Select value={formData.status} onValueChange={(value: Staff["status"]) => setFormData({ ...formData, status: value })}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dang lam">Đang làm</SelectItem>
                  <SelectItem value="Nghi phep">Nghỉ phép</SelectItem>
                  <SelectItem value="Da nghi">Đã nghỉ</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-blue-900">Tạo tài khoản đăng nhập</p>
                  <p className="text-sm text-blue-700">
                    Ưu tiên tạo tài khoản cho {isTrainerPosition(formData.position) ? "huấn luyện viên" : "nhân viên"} ngay khi tạo nhân sự.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setAccountForm((current) => ({ ...current, enabled: !current.enabled }))}
                  className={`rounded-full px-4 py-2 text-sm ${
                    accountForm.enabled
                      ? "bg-blue-600 text-white"
                      : "border border-blue-200 bg-white text-blue-700"
                  }`}
                >
                  {accountForm.enabled ? "Da bat" : "Dang tat"}
                </button>
              </div>

              {accountForm.enabled && (
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="staff-username">Username</Label>
                    <Input
                      id="staff-username"
                      value={accountForm.username}
                      onChange={(e) =>
                        setAccountForm((current) => ({ ...current, username: e.target.value }))
                      }
                      placeholder="trainer.nguyenvana"
                    />
                  </div>
                  <div>
                    <Label htmlFor="staff-password">Mật khẩu</Label>
                    <Input
                      id="staff-password"
                      value={accountForm.password}
                      onChange={(e) =>
                        setAccountForm((current) => ({ ...current, password: e.target.value }))
                      }
                      placeholder="Nhập mật khẩu"
                    />
                  </div>
                  <p className="text-sm text-blue-700 md:col-span-2">
                    Tài khoản sẽ được lưu với vai trò {isTrainerPosition(formData.position) ? "`trainer`" : "`staff`"}.
                  </p>
                </div>
              )}
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
