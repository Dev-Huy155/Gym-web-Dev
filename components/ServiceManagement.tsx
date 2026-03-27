import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Clock, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';

interface Service {
  id: number;
  name: string;
  type: string;
  price: number;
  duration: string;
  description: string;
  maxMembers: number;
  active: boolean;
}

const defaultForm: Omit<Service, 'id'> = {
  name: '',
  type: '',
  price: 0,
  duration: '',
  description: '',
  maxMembers: 0,
  active: true,
};

export default function ServiceManagement() {
  const [services, setServices] = useState<Service[]>([
    { id: 1, name: 'Gói Tập 1 Tháng', type: 'Gói Tập', price: 800000, duration: '1 tháng', description: 'Truy cập không giới hạn trong 1 tháng', maxMembers: 0, active: true },
    { id: 2, name: 'Gói Tập 3 Tháng', type: 'Gói Tập', price: 2100000, duration: '3 tháng', description: 'Tiết kiệm 300k', maxMembers: 0, active: true },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState(defaultForm);

  // =========================
  // FILTER
  // =========================
  const filteredServices = services.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // =========================
  // ACTIONS
  // =========================
  const handleAdd = () => {
    setEditingService(null);
    setFormData(defaultForm);
    setIsDialogOpen(true);
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({ ...service }); // clone tránh bug
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (!confirm('Bạn chắc chắn muốn xóa?')) return;
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  const handleSave = () => {
    // validate
    if (!formData.name || !formData.type) {
      alert('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    if (editingService) {
      setServices((prev) =>
        prev.map((s) =>
          s.id === editingService.id ? { ...formData, id: s.id } : s
        )
      );
    } else {
      setServices((prev) => [
        ...prev,
        { ...formData, id: Date.now() },
      ]);
    }

    setIsDialogOpen(false);
  };

  // =========================
  // UI HELPERS
  // =========================
  const formatPrice = (price: number) =>
    price.toLocaleString('vi-VN');

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Gói Tập':
        return 'bg-blue-100 text-blue-800';
      case 'PT':
        return 'bg-purple-100 text-purple-800';
      case 'Lớp Học':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // =========================
  // RENDER
  // =========================
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Quản Lý Dịch Vụ</h1>
          <p className="text-gray-500">Quản lý gói tập, PT và lớp học</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm
        </Button>
      </div>

      {/* SEARCH */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Tìm kiếm..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* LIST */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <Card key={service.id} className={!service.active ? 'opacity-50' : ''}>
            <CardHeader>
              <div className="flex justify-between">
                <CardTitle>{service.name}</CardTitle>
                <Badge className={getTypeColor(service.type)}>
                  {service.type}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="text-2xl text-blue-600 font-bold">
                {formatPrice(service.price)} VNĐ
              </div>

              <p className="text-sm text-gray-600">{service.description}</p>

              <div className="flex gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {service.duration}
                </div>

                {service.maxMembers > 0 && (
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {service.maxMembers}
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <Button size="sm" onClick={() => handleEdit(service)}>
                  <Edit className="w-4 h-4 mr-1" />
                  Sửa
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(service.id)}
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
              {editingService ? 'Sửa' : 'Thêm'} dịch vụ
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
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
            />

            <Input
              type="number"
              placeholder="Giá"
              value={formData.price}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  price: Number(e.target.value) || 0,
                })
              }
            />

            <Input
              placeholder="Thời hạn"
              value={formData.duration}
              onChange={(e) =>
                setFormData({ ...formData, duration: e.target.value })
              }
            />

            <Textarea
              placeholder="Mô tả"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />

            <Input
              type="number"
              placeholder="Max members"
              value={formData.maxMembers}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  maxMembers: Number(e.target.value) || 0,
                })
              }
            />

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    active: e.target.checked,
                  })
                }
              />
              Active
            </label>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSave}>Lưu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}