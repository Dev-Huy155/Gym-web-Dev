import React, { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, Phone, Mail } from "lucide-react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface Staff {
  id: number;
  name: string;
  position: string;
  phone: string;
  email: string;
  address: string;
  joinDate: string;
  salary: number;
  status: "Đang làm" | "Nghỉ phép" | "Đã nghỉ";
}

export default function StaffManagement() {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    position: "",
    phone: "",
    email: "",
    address: "",
    joinDate: "",
    salary: "",
    status: "Đang làm" as Staff["status"],
  });

  // ================= LOAD =================
  const loadData = async () => {
    try {
      const res = await fetch("http://localhost:3001/staff");
      const data = await res.json();

      const formatted = data.map((item: any) => ({
        id: item.ID,
        name: item.NAME,
        position: item.POSITION,
        phone: item.PHONE,
        email: item.EMAIL,
        address: item.ADDRESS,
        joinDate: item.JOIN_DATE,
        salary: item.SALARY,
        status: item.STATUS || "Đang làm",
      }));

      setStaffList(formatted);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ================= FILTER =================
  const filteredStaff = staffList.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ================= ACTION =================
  const handleAdd = () => {
    setEditingStaff(null);
    setFormData({
      name: "",
      position: "",
      phone: "",
      email: "",
      address: "",
      joinDate: "",
      salary: "",
      status: "Đang làm",
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (staff: Staff) => {
    setEditingStaff(staff);
    setFormData({
      ...staff,
      salary: String(staff.salary),
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Xóa nhân viên?")) return;

    await fetch(`http://localhost:3001/staff/${id}`, {
      method: "DELETE",
    });

    loadData();
  };

  const handleSave = async () => {
    const url = editingStaff
      ? `http://localhost:3001/staff/${editingStaff.id}`
      : "http://localhost:3001/staff";

    const method = editingStaff ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        salary: Number(formData.salary) || 0,
      }),
    });

    const result = await res.json();

    if (res.ok) {
      loadData();
      setIsDialogOpen(false);
    } else {
      alert(result.error);
    }
  };

  // ================= UI HELP =================
  const formatDate = (date: string) =>
    date ? new Date(date).toLocaleDateString("vi-VN") : "";

  const formatMoney = (money: number) =>
    money?.toLocaleString("vi-VN") + " VNĐ";

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Đang làm":
        return "bg-green-100 text-green-700";
      case "Nghỉ phép":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getInitials = (name: string) => {
    const words = name.split(" ");
    return words.map((w) => w[0]).slice(0, 2).join("");
  };

  return (
    <div className="space-y-6 bg-white p-4">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Nhân Viên</h1>
          <p className="text-gray-500">Quản lý nhân sự</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm
        </Button>
      </div>

      {/* SEARCH */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Tìm kiếm..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* LIST */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStaff.map((s) => (
          <Card key={s.id} className="border shadow-sm hover:shadow-md transition">
            <CardHeader className="flex flex-row items-center gap-3">
              <Avatar>
                <AvatarFallback>{getInitials(s.name)}</AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <p className="font-medium">{s.name}</p>
                <p className="text-sm text-gray-500">{s.position}</p>
              </div>

              <Badge className={getStatusColor(s.status)}>
                {s.status}
              </Badge>
            </CardHeader>

            <CardContent className="space-y-2 text-sm">
              <p>📞 {s.phone}</p>
              <p>📧 {s.email}</p>
              <p>📍 {s.address}</p>

              <div className="border-t pt-2 text-gray-600">
                <p>📅 {formatDate(s.joinDate)}</p>
                <p>💰 {formatMoney(s.salary)}</p>
              </div>

              <div className="flex gap-2 pt-2">
                <Button size="sm" onClick={() => handleEdit(s)}>
                  <Edit className="w-4 h-4 mr-1" /> Sửa
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(s.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* DIALOG */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingStaff ? "Sửa" : "Thêm"} nhân viên
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            {["name", "position", "phone", "email", "address"].map((field) => (
              <Input
                key={field}
                placeholder={field}
                value={(formData as any)[field]}
                onChange={(e) =>
                  setFormData({ ...formData, [field]: e.target.value })
                }
              />
            ))}

            <Input
              type="date"
              value={formData.joinDate}
              onChange={(e) =>
                setFormData({ ...formData, joinDate: e.target.value })
              }
            />

            <Input
              placeholder="Lương"
              value={formData.salary}
              onChange={(e) =>
                setFormData({ ...formData, salary: e.target.value })
              }
            />

            <Select
              value={formData.status}
              onValueChange={(v: Staff["status"]) =>
                setFormData({ ...formData, status: v })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Đang làm">Đang làm</SelectItem>
                <SelectItem value="Nghỉ phép">Nghỉ phép</SelectItem>
                <SelectItem value="Đã nghỉ">Đã nghỉ</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button onClick={handleSave}>Lưu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}