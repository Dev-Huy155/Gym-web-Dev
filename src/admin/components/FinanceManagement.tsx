import React, { useState, useEffect } from 'react';
import { Plus, Search, DollarSign, TrendingUp, TrendingDown, Calendar, Edit, Trash2 } from 'lucide-react';
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
  transactionDate: string;
  type: 'Thu' | 'Chi';
  category: string;
  description: string;
  amount: number;
  paymentMethod: string;
  customerId?: number | null;
}

export default function FinanceManagement() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'Tất cả' | 'Thu' | 'Chi'>('Tất cả');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const [formData, setFormData] = useState({
    transactionDate: '',
    type: 'Thu' as Transaction['type'],
    category: '',
    description: '',
    amount: 0,
    paymentMethod: '',
    customerId: '',
  });

  const loadData = () => {
    fetch('http://localhost:3001/transactions')
      .then((res) => res.json())
      .then((data) => {
        const normalized = (data || []).map((item: Transaction) => ({
          ...item,
          transactionDate: item.transactionDate || '',
          amount: Number(item.amount) || 0,
          customerId: item.customerId ?? null,
        }));
        setTransactions(normalized);
      })
      .catch((err) => console.error('Lỗi fetch transactions:', err));
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = 
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'Tất cả' || transaction.type === filterType;
    return matchesSearch && matchesType;
  });

  const totalRevenue = transactions
    .filter((t) => t.type === 'Thu')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'Chi')
    .reduce((sum, t) => sum + t.amount, 0);

  const netProfit = totalRevenue - totalExpense;

  const handleAdd = () => {
    setEditingTransaction(null);
    setFormData({
      transactionDate: '',
      type: 'Thu',
      category: '',
      description: '',
      amount: 0,
      paymentMethod: '',
      customerId: '',
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      transactionDate: transaction.transactionDate,
      type: transaction.type,
      category: transaction.category,
      description: transaction.description,
      amount: transaction.amount,
      paymentMethod: transaction.paymentMethod,
      customerId: transaction.customerId ? String(transaction.customerId) : '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc muốn xóa giao dịch này?')) return;

    try {
      const response = await fetch(`http://localhost:3001/transactions/${id}`, {
        method: 'DELETE',
      });
      const result = await response.json();

      if (response.ok) {
        alert('🗑️ Xóa giao dịch thành công');
        loadData();
      } else {
        alert('❌ Lỗi: ' + (result.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Delete transaction error:', err);
      alert('❌ Không kết nối server');
    }
  };

  const handleSave = async () => {
    if (
      !formData.transactionDate ||
      !formData.type.trim() ||
      !formData.category.trim() ||
      !formData.paymentMethod.trim() ||
      Number(formData.amount) <= 0
    ) {
      alert('❌ Vui lòng điền đầy đủ thông tin bắt buộc và số tiền hợp lệ');
      return;
    }

    const url = editingTransaction
      ? `http://localhost:3001/transactions/${editingTransaction.id}`
      : 'http://localhost:3001/transactions';
    const method = editingTransaction ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transactionDate: formData.transactionDate,
          type: formData.type,
          category: formData.category,
          description: formData.description,
          amount: Number(formData.amount),
          paymentMethod: formData.paymentMethod,
          customerId: formData.customerId ? Number(formData.customerId) : null,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert(`✅ ${editingTransaction ? 'Cập nhật' : 'Thêm'} giao dịch thành công`);
        setIsDialogOpen(false);
        setEditingTransaction(null);
        loadData();
      } else {
        alert('❌ Lỗi: ' + (result.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Save transaction error:', err);
      alert('❌ Không kết nối server');
    }
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('vi-VN') + ' đ';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Quản Lý Tài Chính</h1>
          <p className="text-gray-600">Theo dõi thu chi và báo cáo tài chính</p>
        </div>
        <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Thêm Giao Dịch
        </Button>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Tổng Thu</p>
                <h3 className="text-2xl text-green-600 mb-1">{formatCurrency(totalRevenue)}</h3>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  Thu nhập từ dịch vụ
                </p>
              </div>
              <div className="bg-green-100 text-green-600 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Tổng Chi</p>
                <h3 className="text-2xl text-red-600 mb-1">{formatCurrency(totalExpense)}</h3>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <TrendingDown className="w-4 h-4" />
                  Chi phí hoạt động
                </p>
              </div>
              <div className="bg-red-100 text-red-600 p-3 rounded-lg">
                <TrendingDown className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Lợi Nhuận</p>
                <h3 className={`text-2xl mb-1 ${netProfit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  {formatCurrency(netProfit)}
                </h3>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  Thu - Chi
                </p>
              </div>
              <div className={`${netProfit >= 0 ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'} p-3 rounded-lg`}>
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Tìm kiếm giao dịch..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterType === 'Tất cả' ? 'default' : 'outline'}
                onClick={() => setFilterType('Tất cả')}
              >
                Tất cả
              </Button>
              <Button
                variant={filterType === 'Thu' ? 'default' : 'outline'}
                onClick={() => setFilterType('Thu')}
                className={filterType === 'Thu' ? 'bg-green-600 hover:bg-green-700' : ''}
              >
                Thu
              </Button>
              <Button
                variant={filterType === 'Chi' ? 'default' : 'outline'}
                onClick={() => setFilterType('Chi')}
                className={filterType === 'Chi' ? 'bg-red-600 hover:bg-red-700' : ''}
              >
                Chi
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lịch Sử Giao Dịch</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ngày</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Danh Mục</TableHead>
                <TableHead>Mô Tả</TableHead>
                <TableHead>Phương Thức</TableHead>
                <TableHead>Khách Hàng ID</TableHead>
                <TableHead className="text-right">Số Tiền</TableHead>
                <TableHead className="text-right">Thao Tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {transaction.transactionDate}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={transaction.type === 'Thu' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {transaction.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{transaction.category}</TableCell>
                  <TableCell className="max-w-xs truncate">{transaction.description}</TableCell>
                  <TableCell>{transaction.paymentMethod}</TableCell>
                  <TableCell>{transaction.customerId || '-'}</TableCell>
                  <TableCell className={`text-right ${transaction.type === 'Thu' ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.type === 'Thu' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(transaction)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(transaction.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Transaction Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTransaction ? 'Chỉnh Sửa Giao Dịch' : 'Thêm Giao Dịch Mới'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="transactionDate">Ngày</Label>
              <Input
                id="transactionDate"
                type="date"
                value={formData.transactionDate}
                onChange={(e) => setFormData({ ...formData, transactionDate: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="type">Loại</Label>
              <Select
                value={formData.type}
                onValueChange={(value: Transaction['type']) =>
                  setFormData({ ...formData, type: value })
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
            </div>
            <div>
              <Label htmlFor="category">Danh Mục</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Đăng ký gói tập, Lương..."
              />
            </div>
            <div>
              <Label htmlFor="description">Mô Tả</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Chi tiết về giao dịch..."
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="amount">Số Tiền (VNĐ)</Label>
               <Input
               id="amount"
               type="text"
               value={formData.amount.toLocaleString('vi-VN')}
               onChange={(e) => {
                const raw = e.target.value.replace(/\D/g, '');

               setFormData({
                ...formData,
                amount: raw ? Number(raw) : 0,
                   });
              }}
               placeholder="0"
                />
            </div>
            <div>
              <Label htmlFor="customerId">Mã Khách Hàng (tùy chọn)</Label>
              <Input
                id="customerId"
                type="number"
                value={formData.customerId}
                onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                placeholder="VD: 1"
              />
            </div>
            <div>
              <Label htmlFor="paymentMethod">Phương Thức Thanh Toán</Label>
              <Select
                value={formData.paymentMethod}
                onValueChange={(value: string) =>
                  setFormData({ ...formData, paymentMethod: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn phương thức" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tiền mặt">Tiền mặt</SelectItem>
                  <SelectItem value="Chuyển khoản">Chuyển khoản</SelectItem>
                  <SelectItem value="Thẻ">Thẻ</SelectItem>
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
