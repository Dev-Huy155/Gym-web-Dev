import { useEffect, useState } from "react";
import { BellRing, PencilLine, Send } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import {
  getAnnouncements,
  pushAdminNotification,
  saveAnnouncement,
  updateAnnouncement,
  type BroadcastAnnouncement,
} from "../../lib/storage";

export default function AnnouncementManagement() {
  const [announcements, setAnnouncements] = useState<BroadcastAnnouncement[]>([]);
  const [editingAnnouncement, setEditingAnnouncement] = useState<BroadcastAnnouncement | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formState, setFormState] = useState({
    title: "",
    content: "",
    audience: "all" as BroadcastAnnouncement["audience"],
    createdBy: "System Admin",
    pinned: false,
    active: true,
  });

  const loadData = () => {
    setAnnouncements(getAnnouncements());
  };

  useEffect(() => {
    loadData();
    const intervalId = window.setInterval(loadData, 3000);
    window.addEventListener("storage", loadData);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("storage", loadData);
    };
  }, []);

  const openCreateDialog = () => {
    setEditingAnnouncement(null);
    setFormState({
      title: "",
      content: "",
      audience: "all",
      createdBy: "System Admin",
      pinned: false,
      active: true,
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (announcement: BroadcastAnnouncement) => {
    setEditingAnnouncement(announcement);
    setFormState({
      title: announcement.title,
      content: announcement.content,
      audience: announcement.audience,
      createdBy: announcement.createdBy,
      pinned: announcement.pinned,
      active: announcement.active,
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    const payload = {
      title: formState.title,
      content: formState.content,
      audience: formState.audience,
      createdBy: formState.createdBy,
      pinned: formState.pinned,
      active: formState.active,
    };

    if (editingAnnouncement) {
      updateAnnouncement(editingAnnouncement.id, payload);
    } else {
      saveAnnouncement(payload);
    }

    pushAdminNotification({
      title: "Thong bao moi da duoc dang",
      message: `${payload.createdBy} vua dang thong bao "${payload.title}".`,
      type: "announcement",
    });

    setIsDialogOpen(false);
    setEditingAnnouncement(null);
    loadData();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Quan Ly Thong Bao</h1>
          <p className="text-gray-600">Dang thong bao rieng cho trang nguoi dung va portal nhan su</p>
        </div>
        <Button onClick={openCreateDialog} className="bg-blue-600 hover:bg-blue-700">
          <Send className="w-4 h-4 mr-2" />
          Tao thong bao
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellRing className="w-5 h-5 text-fuchsia-600" />
            Danh sach thong bao
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {announcements.map((item) => (
            <div key={item.id} className="rounded-xl border p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-medium">{item.title}</div>
                  <div className="text-sm text-gray-500">
                    Audience: {item.audience} | {item.active ? "Active" : "Hidden"}
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => openEditDialog(item)}>
                  <PencilLine className="w-4 h-4 mr-2" />
                  Sua
                </Button>
              </div>
              <p className="mt-3 text-sm text-gray-600">{item.content}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingAnnouncement ? "Sua thong bao" : "Tao thong bao"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Tieu de</Label>
              <Input value={formState.title} onChange={(event) => setFormState((current) => ({ ...current, title: event.target.value }))} />
            </div>
            <div>
              <Label>Noi dung</Label>
              <Textarea value={formState.content} onChange={(event) => setFormState((current) => ({ ...current, content: event.target.value }))} />
            </div>
            <div>
              <Label>Audience</Label>
              <Select value={formState.audience} onValueChange={(value: BroadcastAnnouncement["audience"]) => setFormState((current) => ({ ...current, audience: value }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">public</SelectItem>
                  <SelectItem value="staff">staff</SelectItem>
                  <SelectItem value="all">all</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Nguoi dang</Label>
              <Input value={formState.createdBy} onChange={(event) => setFormState((current) => ({ ...current, createdBy: event.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button type="button" variant={formState.pinned ? "default" : "outline"} onClick={() => setFormState((current) => ({ ...current, pinned: !current.pinned }))}>
                {formState.pinned ? "Dang ghim" : "Ghim thong bao"}
              </Button>
              <Button type="button" variant={formState.active ? "default" : "outline"} onClick={() => setFormState((current) => ({ ...current, active: !current.active }))}>
                {formState.active ? "Dang hien" : "Dang an"}
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Huy</Button>
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">Luu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
