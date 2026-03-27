import React, { useState, useEffect } from 'react';
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
  durationDays: number;
  description: string;
  maxMembers: number;
  active: boolean;
}

export default function ServiceManagement() {
  const [services, setServices] = useState<Service[]>([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    type: '',
    price: 0,
    durationDays: 30,
    description: '',
    maxMembers: 0,
    active: true,
  });

  const loadData = () => {
    fetch('http://localhost:3001/services')
      .then((res) => res.json())
      .then((data) => {
        const normalized = (data || []).map((item: Service) => ({
          ...item,
          price: Number(item.price) || 0,
          durationDays: Number(item.durationDays) || 0,
          maxMembers: Number(item.maxMembers) || 0,
          active: Boolean(item.active),
        }));
        setServices(normalized);
      })
      .catch((err) => console.error('Lỗi fetch services:', err));
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setEditingService(null);
    setFormData({
      name: '',
      type: '',
      price: 0,
      durationDays: 30,
      description: '',
      maxMembers: 0,
      active: true,
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData(service);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc muốn xóa dịch vụ này?')) return;

    try {
      const response = await fetch(`http://localhost:3001/services/${id}`, {
        method: 'DELETE',
      });
      const result = await response.json();

      if (response.ok) {
        alert('🗑️ Xóa dịch vụ thành công');
        loadData();
      } else {
        alert('❌ Lỗi: ' + (result.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Delete service error:', err);
      alert('❌ Không kết nối server');
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.type.trim()) {
      alert('❌ Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    const url = editingService
      ? `http://localhost:3001/services/${editingService.id}`
      : 'http://localhost:3001/services';
    const method = editingService ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price) || 0,
          durationDays: Number(formData.durationDays) || 0,
          maxMembers: Number(formData.maxMembers) || 0,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert(`✅ ${editingService ? 'Cập nhật' : 'Thêm'} dịch vụ thành công`);
        loadData();
        setIsDialogOpen(false);
        setEditingService(null);
      } else {
        alert('❌ Lỗi: ' + (result.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Save service error:', err);
      alert('❌ Không kết nối server');
    }
  };

  const formatCurrency = (value: number) => value.toLocaleString('vi-VN');

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Quản Lý Dịch Vụ</h1>
          <p className="text-gray-600">Quản lý gói tập, dịch vụ và lớp học</p>
        </div>
        <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Thêm Dịch Vụ
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Tìm kiếm dịch vụ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Service List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <Card key={service.id} className={!service.active ? 'opacity-60' : ''}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{service.name}</CardTitle>
                <Badge className={getTypeColor(service.type)}>
                  {service.type}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl text-blue-600">{formatCurrency(service.price)}</span>
                <span className="text-gray-600">VNĐ</span>
              </div>

              <p className="text-sm text-gray-700">{service.description}</p>

              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{service.durationDays} ngày</span>
                </div>
                {service.maxMembers > 0 && (
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>Tối đa {service.maxMembers}</span>
                  </div>
                )}
              </div>

              {!service.active && (
                <Badge className="bg-gray-100 text-gray-800">Ngừng cung cấp</Badge>
              )}

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(service)}
                  className="flex-1"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Sửa
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(service.id)}
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
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingService ? 'Chỉnh Sửa Dịch Vụ' : 'Thêm Dịch Vụ Mới'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Tên Dịch Vụ</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Gói tập 1 tháng..."
              />
            </div>
            <div>
              <Label htmlFor="type">Loại Dịch Vụ</Label>
              <Input
                id="type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                placeholder="Gói Tập, PT, Lớp Học..."
              />
            </div>
            <div>
              <Label htmlFor="price">Giá (VNĐ)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) || 0 })}
                placeholder="800000"
              />
            </div>
            <div>
              <Label htmlFor="durationDays">Thời Hạn (ngày)</Label>
              <Input
                id="durationDays"
                type="number"
                value={formData.durationDays}
                onChange={(e) => setFormData({ ...formData, durationDays: Number(e.target.value) || 0 })}
                placeholder="30"
              />
            </div>
            <div>
              <Label htmlFor="description">Mô Tả</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Mô tả chi tiết về dịch vụ..."
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="maxMembers">Số Lượng Tối Đa (0 = không giới hạn)</Label>
              <Input
                id="maxMembers"
                type="number"
                value={formData.maxMembers}
                onChange={(e) => setFormData({ ...formData, maxMembers: parseInt(e.target.value) || 0 })}
                placeholder="0"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="active"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="w-4 h-4"
              />
              <Label htmlFor="active" className="cursor-pointer">Đang hoạt động</Label>
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
