import React, { useState } from 'react';
import { Plus, Search, DollarSign, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

interface Transaction {
  id: number;
  date: string;
  type: 'Thu' | 'Chi';
  category: string;
  description: string;
  amount: number;
  paymentMethod: string;
}

const defaultForm = {
  date: new Date().toISOString().split('T')[0],
  type: 'Thu' as Transaction['type'],
  category: '',
  description: '',
  amount: 0,
  paymentMethod: '',
};

export default function FinanceManagement() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'Tất cả' | 'Thu' | 'Chi'>('Tất cả');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState(defaultForm);

  // =========================
  // FILTER
  // =========================
  const filteredTransactions = transactions.filter((t) => {
    const search = searchTerm.toLowerCase();
    const matchSearch =
      t.category.toLowerCase().includes(search) ||
      t.description.toLowerCase().includes(search);

    const matchType =
      filterType === 'Tất cả' || t.type === filterType;

    return matchSearch && matchType;
  });

  // =========================
  // CALCULATE
  // =========================
  const totalRevenue = transactions
    .filter((t) => t.type === 'Thu')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'Chi')
    .reduce((sum, t) => sum + t.amount, 0);

  const netProfit = totalRevenue - totalExpense;

  // =========================
  // ACTIONS
  // =========================
  const handleAdd = () => {
    setFormData(defaultForm);
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.category || !formData.amount) {
      alert('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    const newTransaction: Transaction = {
      ...formData,
      id: Date.now(),
    };

    setTransactions((prev) => [newTransaction, ...prev]);
    setIsDialogOpen(false);
  };

  // =========================
  // HELPERS
  // =========================
  const formatCurrency = (amount: number) =>
    amount.toLocaleString('vi-VN') + ' đ';

  // =========================
  // RENDER
  // =========================
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Quản Lý Tài Chính</h1>
          <p className="text-gray-500">Theo dõi thu chi</p>
        </div>

        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm
        </Button>
      </div>

      {/* SUMMARY */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-gray-500">Tổng Thu</p>
            <h3 className="text-2xl text-green-600">
              {formatCurrency(totalRevenue)}
            </h3>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-gray-500">Tổng Chi</p>
            <h3 className="text-2xl text-red-600">
              {formatCurrency(totalExpense)}
            </h3>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-gray-500">Lợi Nhuận</p>
            <h3 className={netProfit >= 0 ? 'text-blue-600' : 'text-red-600'}>
              {formatCurrency(netProfit)}
            </h3>
          </CardContent>
        </Card>
      </div>

      {/* FILTER */}
      <Card>
        <CardContent className="p-4 flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              className="pl-10"
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Button
            variant={filterType === 'Tất cả' ? 'default' : 'outline'}
            onClick={() => setFilterType('Tất cả')}
          >
            Tất cả
          </Button>

          <Button
            variant={filterType === 'Thu' ? 'default' : 'outline'}
            onClick={() => setFilterType('Thu')}
          >
            Thu
          </Button>

          <Button
            variant={filterType === 'Chi' ? 'default' : 'outline'}
            onClick={() => setFilterType('Chi')}
          >
            Chi
          </Button>
        </CardContent>
      </Card>

      {/* TABLE */}
      <Card>
        <CardHeader>
          <CardTitle>Giao Dịch</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ngày</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Danh Mục</TableHead>
                <TableHead>Mô Tả</TableHead>
                <TableHead>Thanh Toán</TableHead>
                <TableHead className="text-right">Tiền</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredTransactions.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>{t.date}</TableCell>

                  <TableCell>
                    <Badge className={t.type === 'Thu' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                      {t.type}
                    </Badge>
                  </TableCell>

                  <TableCell>{t.category}</TableCell>
                  <TableCell>{t.description}</TableCell>
                  <TableCell>{t.paymentMethod}</TableCell>

                  <TableCell className={`text-right ${t.type === 'Thu' ? 'text-green-600' : 'text-red-600'}`}>
                    {t.type === 'Thu' ? '+' : '-'}{formatCurrency(t.amount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* DIALOG */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm giao dịch</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <Input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
            />

            <Select
              value={formData.type}
              onValueChange={(v: Transaction['type']) =>
                setFormData({ ...formData, type: v })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Thu">Thu</SelectItem>
                <SelectItem value="Chi">Chi</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Danh mục"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
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
              placeholder="Số tiền"
              value={formData.amount}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  amount: Number(e.target.value) || 0,
                })
              }
            />

            <Select
              value={formData.paymentMethod}
              onValueChange={(v: string) =>
                setFormData({ ...formData, paymentMethod: v })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Thanh toán" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Tiền mặt">Tiền mặt</SelectItem>
                <SelectItem value="Chuyển khoản">Chuyển khoản</SelectItem>
                <SelectItem value="Thẻ">Thẻ</SelectItem>
              </SelectContent>
            </Select>
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