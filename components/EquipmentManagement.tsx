import React, { useEffect, useState } from "react";
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

const API = "http://localhost:3001/equipment";

export default function EquipmentManagement() {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] =
    useState<Equipment | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<Omit<Equipment, "id">>({
    name: "",
    category: "",
    status: "Hoạt động",
    purchaseDate: "",
    lastMaintenance: "",
    location: "",
  });

  // ================= FETCH =================
  const fetchEquipments = async () => {
    try {
      setLoading(true);
      const res = await fetch(API);
      const data = await res.json();
      setEquipments(data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipments();
  }, []);

  // ================= CRUD =================

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
    setFormData(equipment);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn chắc chắn muốn xóa?")) return;

    try {
      await fetch(`${API}/${id}`, { method: "DELETE" });
      fetchEquipments();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    try {
      const method = editingEquipment ? "PUT" : "POST";
      const url = editingEquipment
        ? `${API}/${editingEquipment.id}`
        : API;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error);
        return;
      }

      fetchEquipments();
      setIsDialogOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= FILTER =================
  const filteredEquipments = equipments.filter(
    (e) =>
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ================= UI =================
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Hoạt động":
        return "bg-green-100 text-green-800";
      case "Bảo trì":
        return "bg-yellow-100 text-yellow-800";
      case "Hỏng":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100";
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between">
        <div>
          <h1 className="text-3xl mb-2">Quản Lý Thiết Bị</h1>
          <p className="text-gray-600">Kết nối DB thật 🚀</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm
        </Button>
      </div>

      {/* SEARCH */}
      <Card>
        <CardContent className="p-4">
          <Input
            placeholder="Tìm kiếm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* LIST */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {filteredEquipments.map((e) => (
            <Card key={e.id}>
              <CardHeader>
                <CardTitle className="flex justify-between">
                  {e.name}
                  <Badge className={getStatusColor(e.status)}>
                    {e.status}
                  </Badge>
                </CardTitle>
              </CardHeader>

              <CardContent>
                <p>Loại: {e.category}</p>
                <p>Vị trí: {e.location}</p>
                <p>Ngày mua: {e.purchaseDate}</p>

                {e.status === "Bảo trì" && (
                  <div className="flex items-center gap-2 text-yellow-600">
                    <AlertCircle size={16} /> Đang bảo trì
                  </div>
                )}

                <div className="flex gap-2 mt-3">
                  <Button size="sm" onClick={() => handleEdit(e)}>
                    <Edit size={14} /> Sửa
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(e.id)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* DIALOG */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingEquipment ? "Sửa" : "Thêm"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <Input
              placeholder="Tên"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />

            <Input
              placeholder="Loại"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            />

            <Select
              value={formData.status}
              onValueChange={(v: any) =>
                setFormData({ ...formData, status: v })
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

            <Input
              type="date"
              value={formData.purchaseDate}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  purchaseDate: e.target.value,
                })
              }
            />

            <Input
              type="date"
              value={formData.lastMaintenance}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  lastMaintenance: e.target.value,
                })
              }
            />

            <Input
              placeholder="Vị trí"
              value={formData.location}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  location: e.target.value,
                })
              }
            />
          </div>

          <DialogFooter>
            <Button onClick={() => setIsDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSave}>Lưu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}