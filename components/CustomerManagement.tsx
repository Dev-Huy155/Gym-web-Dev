import React, { useState, useMemo } from 'react';
import { Plus, Search, Edit, Trash2, Phone, Mail, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';

// ================= ENUM =================
export enum Status {
  ACTIVE = 'Đang hoạt động',
  EXPIRED = 'Hết hạn',
  PAUSED = 'Tạm ngừng'
}

// ================= TYPES =================
interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  membershipType: string;
  startDate: string;
  endDate: string;
  status: Status;
  visits: number;
}

type CustomerForm = Omit<Customer, 'id'>;

// ================= DEFAULT =================
const defaultForm: CustomerForm = {
  name: '',
  phone: '',
  email: '',
  address: '',
  membershipType: '',
  startDate: '',
  endDate: '',
  status: Status.ACTIVE,
  visits: 0,
};

export default function CustomerManagement() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState<CustomerForm>(defaultForm);

  // ================= AUTO STATUS =================
  const getStatus = (endDate: string, current: Status): Status => {
    if (!endDate) return current;

    const today = new Date();
    const end = new Date(endDate);

    if (end < today) return Status.EXPIRED;
    return current;
  };

  // ================= FILTER =================
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const search = searchTerm.toLowerCase();
      return (
        c.name.toLowerCase().includes(search) ||
        c.phone.includes(searchTerm) ||
        c.membershipType.toLowerCase().includes(search)
      );
    });
  }, [customers, searchTerm]);

  // ================= ACTIONS =================
  const handleAdd = () => {
    setEditingCustomer(null);
    setFormData(defaultForm);
    setIsDialogOpen(true);
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    const { id, ...rest } = customer;
    setFormData(rest);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (!confirm('Bạn chắc chắn muốn xoá?')) return;
    setCustomers((prev) => prev.filter((c) => c.id !== id));
  };

  const handleSave = () => {
    if (!formData.name || !formData.phone) {
      alert('Nhập tên và SĐT!');
      return;
    }

    const updatedData: Customer = {
      ...formData,
      id: editingCustomer ? editingCustomer.id : Date.now(),
      status: getStatus(formData.endDate, formData.status),
    };

    if (editingCustomer) {
      setCustomers((prev) =>
        prev.map((c) => (c.id === editingCustomer.id ? updatedData : c))
      );
    } else {
      setCustomers((prev) => [...prev, updatedData]);
    }

    setFormData(defaultForm);
    setEditingCustomer(null);
    setIsDialogOpen(false);
  };

  // ================= HELPERS =================
  const getStatusColor = (status: Status) => {
    switch (status) {
      case Status.ACTIVE:
        return 'bg-green-100 text-green-700';
      case Status.EXPIRED:
        return 'bg-red-100 text-red-700';
      case Status.PAUSED:
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((p) => p[0])
      .slice(-2)
      .join('')
      .toUpperCase();
  };

  // ================= AUTO UPDATE =================
  const customersWithStatus = customers.map((c) => ({
    ...c,
    status: getStatus(c.endDate, c.status),
  }));

  // ================= STATS =================
  const activeCount = customersWithStatus.filter(c => c.status === Status.ACTIVE).length;
  const expiredCount = customersWithStatus.filter(c => c.status === Status.EXPIRED).length;
  const pausedCount = customersWithStatus.filter(c => c.status === Status.PAUSED).length;

  // ================= UI =================
  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Khách Hàng</h1>
          <p className="text-gray-500">Quản lý hội viên</p>
        </div>

        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              className="pl-10"
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-4">
        <Card><CardContent className="p-4 text-center text-green-600">{activeCount} Hoạt động</CardContent></Card>
        <Card><CardContent className="p-4 text-center text-red-600">{expiredCount} Hết hạn</CardContent></Card>
        <Card><CardContent className="p-4 text-center text-yellow-600">{pausedCount} Tạm ngừng</CardContent></Card>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customersWithStatus.map((c) => (
          <Card key={c.id}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>{getInitials(c.name)}</AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <CardTitle>{c.name}</CardTitle>
                  <p className="text-sm text-gray-500">{c.membershipType}</p>
                </div>

                <Badge className={getStatusColor(c.status)}>
                  {c.status}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center gap-2"><Phone className="w-4 h-4" /> {c.phone}</div>
              <div className="flex items-center gap-2"><Mail className="w-4 h-4" /> {c.email}</div>
              <div>📍 {c.address}</div>
              <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {c.startDate} → {c.endDate}</div>

              <div className="pt-2 border-t">
                Lượt tập: {c.visits}
              </div>

              <div className="flex gap-2 pt-2">
                <Button size="sm" onClick={() => handleEdit(c)}>
                  <Edit className="w-4 h-4 mr-1" /> Sửa
                </Button>

                <Button size="sm" variant="outline" onClick={() => handleDelete(c.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCustomer ? 'Sửa' : 'Thêm'} khách</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <Input placeholder="Tên" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
            <Input placeholder="SĐT" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
            <Input placeholder="Email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
            <Input placeholder="Địa chỉ" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
            <Input placeholder="Gói tập" value={formData.membershipType} onChange={e => setFormData({ ...formData, membershipType: e.target.value })} />
            <Input type="date" value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} />
            <Input type="date" value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} />
            <Input type="number" value={formData.visits} onChange={e => setFormData({ ...formData, visits: Number(e.target.value) || 0 })} />

            <Select value={formData.status} onValueChange={(v: Status) => setFormData({ ...formData, status: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value={Status.ACTIVE}>{Status.ACTIVE}</SelectItem>
                <SelectItem value={Status.EXPIRED}>{Status.EXPIRED}</SelectItem>
                <SelectItem value={Status.PAUSED}>{Status.PAUSED}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Hủy</Button>
            <Button onClick={handleSave}>Lưu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}