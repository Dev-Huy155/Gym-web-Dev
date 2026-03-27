import React, { useEffect, useState } from 'react';
import { Plus, Search, Edit, Trash2, Phone, Mail, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';

const STATUS_ACTIVE = '\u0048\u006f\u1ea1\u0074\u0020\u0111\u1ed9\u006e\u0067';
const STATUS_EXPIRED = '\u0048\u1ebf\u0074\u0020\u0068\u1ea1\u006e';
const STATUS_PAUSED = '\u0054\u1ea1\u006d\u0020\u006e\u0067\u1eeb\u006e\u0067';

interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  membershipType: string;
  startDate: string;
  endDate: string;
  status: typeof STATUS_ACTIVE | typeof STATUS_EXPIRED | typeof STATUS_PAUSED;
  visits: number;
}

type CustomerFormData = {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  membershipType: string;
  startDate: string;
  endDate: string;
  status: Customer['status'];
  visits: number;
};

const DEFAULT_FORM_DATA: CustomerFormData = {
  id: '',
  name: '',
  phone: '',
  email: '',
  address: '',
  membershipType: '',
  startDate: '',
  endDate: '',
  status: STATUS_ACTIVE,
  visits: 0,
};

const normalizeCustomerStatus = (value: string | null | undefined): Customer['status'] => {
  const rawValue = value?.trim() || '';

  if (!rawValue) {
    return STATUS_ACTIVE;
  }

  const normalized = rawValue
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\u0111/g, 'd')
    .replace(/\u0110/g, 'D')
    .toLowerCase();

  if (normalized === 'hoat dong') {
    return STATUS_ACTIVE;
  }

  if (normalized === 'tam ngung') {
    return STATUS_PAUSED;
  }

  if (normalized === 'het han') {
    return STATUS_EXPIRED;
  }

  return STATUS_ACTIVE;
};

export default function CustomerManagement() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState<CustomerFormData>(DEFAULT_FORM_DATA);

  const loadData = () => {
    fetch('http://localhost:3001/customers')
      .then((res) => res.json())
      .then((data) => {
        const normalized = (data || []).map((item: Customer) => ({
          ...item,
          startDate: item.startDate || '',
          endDate: item.endDate || '',
          status: normalizeCustomerStatus(item.status),
          visits: Number(item.visits) || 0,
        }));
        setCustomers(normalized);
      })
      .catch((err) => console.error('Loi fetch customers:', err));
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredCustomers = customers.filter((customer) => {
    const keyword = searchTerm.toLowerCase();

    return (
      customer.id.toString().includes(searchTerm) ||
      customer.name.toLowerCase().includes(keyword) ||
      customer.phone.includes(searchTerm) ||
      customer.membershipType.toLowerCase().includes(keyword)
    );
  });

  const handleAdd = () => {
    setEditingCustomer(null);
    setFormData(DEFAULT_FORM_DATA);
    setIsDialogOpen(true);
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({
      id: String(customer.id),
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      address: customer.address,
      membershipType: customer.membershipType,
      startDate: customer.startDate,
      endDate: customer.endDate,
      status: normalizeCustomerStatus(customer.status),
      visits: customer.visits,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Ban co chac muon xoa khach hang nay?')) return;

    try {
      const response = await fetch(`http://localhost:3001/customers/${id}`, {
        method: 'DELETE',
      });
      const result = await response.json();

      if (response.ok) {
        alert('Xoa khach hang thanh cong');
        loadData();
      } else {
        alert('Loi: ' + (result.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Delete customer error:', err);
      alert('Khong ket noi server');
    }
  };

  const handleSave = async () => {
    const normalizedId = formData.id.trim();

    if (
      !normalizedId ||
      !formData.name.trim() ||
      !formData.phone.trim() ||
      !formData.email.trim() ||
      !formData.membershipType.trim() ||
      !formData.startDate ||
      !formData.endDate ||
      !formData.status.trim()
    ) {
      alert('Vui long dien day du thong tin bat buoc');
      return;
    }

    if (!/^\d+$/.test(normalizedId) || Number(normalizedId) <= 0) {
      alert('ID khach hang phai la so nguyen duong');
      return;
    }

    const url = editingCustomer
      ? `http://localhost:3001/customers/${editingCustomer.id}`
      : 'http://localhost:3001/customers';
    const method = editingCustomer ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          id: Number(normalizedId),
          visits: Number(formData.visits) || 0,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert(`${editingCustomer ? 'Cap nhat' : 'Them'} khach hang thanh cong`);
        loadData();
        setIsDialogOpen(false);
        setEditingCustomer(null);
        setFormData(DEFAULT_FORM_DATA);
      } else {
        alert('Loi: ' + (result.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Save customer error:', err);
      alert('Khong ket noi server');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case STATUS_ACTIVE:
        return 'bg-green-100 text-green-800';
      case STATUS_EXPIRED:
        return 'bg-red-100 text-red-800';
      case STATUS_PAUSED:
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getInitials = (name: string) => {
    const words = name.split(' ').filter(Boolean);
    if (words.length === 0) return 'KH';
    return words[words.length - 1][0] + (words.length > 1 ? words[0][0] : '');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Quản Lý Khách Hàng</h1>
          <p className="text-gray-600">Quản lý thông tin hội viên và gói tập</p>
        </div>
        <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Thêm Khách Hàng
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Tim kiem theo ID, ten, so dien thoai hoac goi tap..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl text-green-600 mb-1">
                {customers.filter((c) => c.status === STATUS_ACTIVE).length}
              </div>
              <p className="text-gray-600">Hoat Dong</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl text-red-600 mb-1">
                {customers.filter((c) => c.status === STATUS_EXPIRED).length}
              </div>
              <p className="text-gray-600">Het Han</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl text-yellow-600 mb-1">
                {customers.filter((c) => c.status === STATUS_PAUSED).length}
              </div>
              <p className="text-gray-600">Tam Ngung</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((customer) => (
          <Card key={customer.id}>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-purple-100 text-purple-600">
                    {getInitials(customer.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-lg">{customer.name}</CardTitle>
                  <p className="text-xs text-gray-500">ID: {customer.id}</p>
                  <p className="text-sm text-gray-600">{customer.membershipType}</p>
                </div>
                <Badge className={getStatusColor(customer.status)}>{customer.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{customer.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="truncate">{customer.email}</span>
                </div>
                <div className="text-sm text-gray-600">
                  <span className="block">Dia chi: {customer.address}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>{customer.startDate} - {customer.endDate}</span>
                </div>
              </div>

              <div className="pt-2 border-t">
                <p className="text-sm">
                  <span className="text-gray-600">So luot tap:</span> {customer.visits}
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(customer)}
                  className="flex-1"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Sua
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(customer.id)}
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
              {editingCustomer ? 'Chinh Sua Khach Hang' : 'Them Khach Hang Moi'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="id">Ma Khach Hang</Label>
              <Input
                id="id"
                type="number"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                placeholder="VD: 101"
                disabled={Boolean(editingCustomer)}
              />
            </div>
            <div>
              <Label htmlFor="name">Ho va Ten</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nguyen Van A..."
              />
            </div>
            <div>
              <Label htmlFor="phone">So Dien Thoai</Label>
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
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@example.com"
              />
            </div>
            <div>
              <Label htmlFor="address">Dia Chi</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="123 Xuan Dieu, Tay Ho, Ha Noi"
              />
            </div>
            <div>
              <Label htmlFor="membershipType">Goi Tap</Label>
              <Input
                id="membershipType"
                value={formData.membershipType}
                onChange={(e) => setFormData({ ...formData, membershipType: e.target.value })}
                placeholder="VIP 12 Thang, Goi 3 Thang..."
              />
            </div>
            <div>
              <Label htmlFor="startDate">Ngay Bat Dau</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="endDate">Ngay Ket Thuc</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="visits">So Luot Tap</Label>
              <Input
                id="visits"
                type="number"
                value={formData.visits}
                onChange={(e) =>
                  setFormData({ ...formData, visits: parseInt(e.target.value, 10) || 0 })
                }
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="status">Trang Thai</Label>
              <Select
                value={formData.status}
                onValueChange={(value: Customer['status']) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={STATUS_ACTIVE}>{STATUS_ACTIVE}</SelectItem>
                  <SelectItem value={STATUS_EXPIRED}>{STATUS_EXPIRED}</SelectItem>
                  <SelectItem value={STATUS_PAUSED}>{STATUS_PAUSED}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Huy
            </Button>
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
              Luu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
