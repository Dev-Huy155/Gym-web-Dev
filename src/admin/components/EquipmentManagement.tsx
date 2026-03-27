import React, { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
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

interface Equipment {
  id: number;
  name: string;
  category: string;
  status: "Hoạt động" | "Bảo trì" | "Hỏng";
  purchaseDate: string;
  lastMaintenance: string;
  location: string;
}

export default function EquipmentManagement() {
  const [equipments, setEquipments] = useState<Equipment[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(
    null,
  );

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    status: "Hoạt động" as Equipment["status"],
    purchaseDate: "",
    lastMaintenance: "",
    location: "",
  });

  // ================= LOAD DATA =================
  const loadData = () => {
    fetch("http://localhost:3001/equipment")
      .then((res) => res.json())
      .then((data) => {
        console.log("Dữ liệu equipment:", data);
        const normalized = (data || []).map((item: Equipment) => ({
          ...item,
          purchaseDate: item.purchaseDate || "",
          lastMaintenance: item.lastMaintenance || "",
          location: item.location || "",
        }));
        setEquipments(normalized);
      })
      .catch((err) => console.error("Lỗi fetch:", err));
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredEquipments = equipments.filter(
    (equipment) =>
      equipment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipment.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleAdd = () => {
    setEditingEquipment(null);
    setFormData({
      name: "",
      category: "",
      status: "Hoạt động",
      purchaseDate: "",
      lastMaintenance: "",
      location: "",
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (equipment: Equipment) => {
    setEditingEquipment(equipment);
    setFormData({
      ...equipment,
      purchaseDate: equipment.purchaseDate || "",
      lastMaintenance: equipment.lastMaintenance || "",
      location: equipment.location || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Bạn có chắc muốn xóa thiết bị này?")) {
      fetch(`http://localhost:3001/equipment/${id}`, {
        method: "DELETE",
      })
        .then(async (res) => {
          const result = await res.json();
          if (!res.ok) throw new Error(result.error || "Delete failed");
          alert("🗑️ Xóa thiết bị thành công");
          loadData();
        })
        .catch((err) => {
          console.error("Delete error:", err);
          alert("❌ Lỗi xóa thiết bị: " + err.message);
        });
    }
  };

  const handleSave = async () => {
    if (
      !formData.name.trim() ||
      !formData.category.trim() ||
      !formData.status.trim() ||
      !formData.purchaseDate
    ) {
      alert("❌ Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    const url = editingEquipment
      ? `http://localhost:3001/equipment/${editingEquipment.id}`
      : "http://localhost:3001/equipment";
    const method = editingEquipment ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        alert(`✅ ${editingEquipment ? "Cập nhật" : "Thêm"} thiết bị thành công`);
        loadData();
        setIsDialogOpen(false);
        setEditingEquipment(null);
      } else {
        alert("❌ Lỗi: " + (result.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("❌ Không kết nối server");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Hoạt động":
        return "bg-green-100 text-green-800";
      case "Bảo trì":
        return "bg-yellow-100 text-yellow-800";
      case "Hỏng":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Quản Lý Thiết Bị</h1>
          <p className="text-gray-600">Quản lý thiết bị tập luyện và bảo trì</p>
        </div>
        <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Thêm Thiết Bị
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Tìm kiếm thiết bị..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Equipment List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEquipments.length === 0 && (
          <Card className="md:col-span-2 lg:col-span-3">
            <CardContent className="p-6 text-sm text-gray-600">
              Chua co du lieu thiet bi trong database.
            </CardContent>
          </Card>
        )}
        {filteredEquipments.map((equipment) => (
          <Card key={equipment.id}>
            <CardHeader>
              <CardTitle className="flex items-start justify-between">
                <span className="text-lg">{equipment.name}</span>
                <Badge className={getStatusColor(equipment.status)}>
                  {equipment.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-gray-600">Loại:</span>{" "}
                  {equipment.category}
                </p>
                <p>
                  <span className="text-gray-600">Vị trí:</span>{" "}
                  {equipment.location}
                </p>
                <p>
                  <span className="text-gray-600">Ngày mua:</span>{" "}
                  {equipment.purchaseDate}
                </p>
                <p>
                  <span className="text-gray-600">Bảo trì gần nhất:</span>{" "}
                  {equipment.lastMaintenance}
                </p>
              </div>

              {equipment.status === "Bảo trì" && (
                <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm text-yellow-800">Đang bảo trì</span>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(equipment)}
                  className="flex-1"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Sửa
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(equipment.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingEquipment ? "Chỉnh Sửa Thiết Bị" : "Thêm Thiết Bị Mới"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Tên Thiết Bị</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Máy chạy bộ..."
              />
            </div>
            <div>
              <Label htmlFor="category">Loại</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                placeholder="Cardio, Tạ, Máy..."
              />
            </div>
            <div>
              <Label htmlFor="status">Trạng Thái</Label>
              <Select
                value={formData.status}
                onValueChange={(value: Equipment["status"]) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Hoạt động">Hoạt động</SelectItem>
                  <SelectItem value="Bảo trì">Bảo trì</SelectItem>
                  <SelectItem value="Hỏng">Hỏng</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="location">Vị Trí</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="Khu A, B, C..."
              />
            </div>
            <div>
              <Label htmlFor="purchaseDate">Ngày Mua</Label>
              <Input
                id="purchaseDate"
                type="date"
                value={formData.purchaseDate}
                onChange={(e) =>
                  setFormData({ ...formData, purchaseDate: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="lastMaintenance">Bảo Trì Gần Nhất</Label>
              <Input
                id="lastMaintenance"
                type="date"
                value={formData.lastMaintenance}
                onChange={(e) =>
                  setFormData({ ...formData, lastMaintenance: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Hủy
            </Button>
            <Button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Lưu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
