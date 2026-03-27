import { useEffect, useMemo, useState } from "react";
import { CalendarClock, DoorOpen, PencilLine } from "lucide-react";
import { Badge } from "./ui/badge";
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
  getRoomBookings,
  getStaffSchedules,
  saveAnnouncement,
  updateRoomBooking,
  updateStaffSchedule,
  type RoomBookingRecord,
  type StaffScheduleRecord,
} from "../../lib/storage";

type EditorState =
  | { type: "schedule"; record: StaffScheduleRecord }
  | { type: "room"; record: RoomBookingRecord }
  | null;

function badgeClass(status: string) {
  switch (status) {
    case "approved":
      return "bg-green-100 text-green-700";
    case "updated":
      return "bg-blue-100 text-blue-700";
    case "rejected":
    case "cancelled":
      return "bg-rose-100 text-rose-700";
    default:
      return "bg-amber-100 text-amber-700";
  }
}

export default function OperationsCenter() {
  const [scheduleRecords, setScheduleRecords] = useState<StaffScheduleRecord[]>([]);
  const [roomRecords, setRoomRecords] = useState<RoomBookingRecord[]>([]);
  const [editor, setEditor] = useState<EditorState>(null);
  const [formState, setFormState] = useState<Record<string, string | boolean>>({});

  const loadData = () => {
    setScheduleRecords(getStaffSchedules());
    setRoomRecords(getRoomBookings());
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

  const pendingSchedules = useMemo(
    () => scheduleRecords.filter((item) => item.status === "pending").length,
    [scheduleRecords],
  );
  const pendingRooms = useMemo(
    () => roomRecords.filter((item) => item.status === "pending").length,
    [roomRecords],
  );

  const openScheduleEditor = (record: StaffScheduleRecord) => {
    setEditor({ type: "schedule", record });
    setFormState({
      scheduleDate: record.scheduleDate,
      shiftLabel: record.shiftLabel,
      startTime: record.startTime,
      endTime: record.endTime,
      status: record.status,
      adminNote: record.adminNote,
    });
  };

  const openRoomEditor = (record: RoomBookingRecord) => {
    setEditor({ type: "room", record });
    setFormState({
      roomName: record.roomName,
      bookingDate: record.bookingDate,
      startTime: record.startTime,
      endTime: record.endTime,
      attendees: String(record.attendees),
      status: record.status,
      adminNote: record.adminNote,
    });
  };

  const handleSave = () => {
    if (!editor) return;

    if (editor.type === "schedule") {
      const updated = updateStaffSchedule(editor.record.id, {
        scheduleDate: String(formState.scheduleDate || ""),
        shiftLabel: String(formState.shiftLabel || ""),
        startTime: String(formState.startTime || ""),
        endTime: String(formState.endTime || ""),
        status: formState.status as StaffScheduleRecord["status"],
        adminNote: String(formState.adminNote || ""),
      });

      saveAnnouncement({
        title: `Lich ${updated.requesterName} da duoc cap nhat`,
        content: `Lich ${updated.shiftLabel} ngay ${updated.scheduleDate} duoc dieu chinh boi admin. Vui long kiem tra portal de xem chi tiet moi nhat.`,
        audience: "staff",
        createdBy: "System Admin",
        pinned: false,
        active: true,
      });
    }

    if (editor.type === "room") {
      const updated = updateRoomBooking(editor.record.id, {
        roomName: String(formState.roomName || ""),
        bookingDate: String(formState.bookingDate || ""),
        startTime: String(formState.startTime || ""),
        endTime: String(formState.endTime || ""),
        attendees: Number(formState.attendees) || 0,
        status: formState.status as RoomBookingRecord["status"],
        adminNote: String(formState.adminNote || ""),
      });

      saveAnnouncement({
        title: `Dat phong ${updated.roomName} duoc cap nhat`,
        content: `Admin vua dieu chinh dat phong cua ${updated.requesterName} vao ngay ${updated.bookingDate}.`,
        audience: "all",
        createdBy: "System Admin",
        pinned: false,
        active: true,
      });
    }

    setEditor(null);
    loadData();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Dieu Phoi Lich & Thong Bao</h1>
          <p className="text-gray-600">
            Nhan lich dang ky cua nhan vien, dat phong va phat thong bao len portal / user page
          </p>
        </div>
        <a href="#/notice-admin" className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
          Mo trang thong bao rieng
        </a>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <div className="text-sm text-gray-500">Lich cho duyet</div>
            <div className="mt-2 text-3xl font-semibold">{pendingSchedules}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="text-sm text-gray-500">Dat phong cho duyet</div>
            <div className="mt-2 text-3xl font-semibold">{pendingRooms}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarClock className="w-5 h-5 text-blue-600" />
              Lich dang ky nhan su
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {scheduleRecords.length === 0 ? (
              <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-600">Chua co lich dang ky.</div>
            ) : (
              scheduleRecords.slice(0, 8).map((item) => (
                <div key={item.id} className="rounded-xl border p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-medium">{item.requesterName}</div>
                      <div className="text-sm text-gray-500">
                        {item.department} | {item.scheduleDate} | {item.startTime} - {item.endTime}
                      </div>
                    </div>
                    <Badge className={badgeClass(item.status)}>{item.status}</Badge>
                  </div>
                  {item.notes && <p className="mt-3 text-sm text-gray-600">{item.notes}</p>}
                  {item.adminNote && <p className="mt-2 text-sm text-blue-600">Admin: {item.adminNote}</p>}
                  <Button variant="outline" size="sm" className="mt-4" onClick={() => openScheduleEditor(item)}>
                    <PencilLine className="w-4 h-4 mr-2" />
                    Sua lich
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DoorOpen className="w-5 h-5 text-emerald-600" />
              Dat phong
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {roomRecords.length === 0 ? (
              <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-600">Chua co dat phong nao.</div>
            ) : (
              roomRecords.slice(0, 8).map((item) => (
                <div key={item.id} className="rounded-xl border p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-medium">{item.requesterName}</div>
                      <div className="text-sm text-gray-500">
                        {item.roomName} | {item.bookingDate} | {item.startTime} - {item.endTime}
                      </div>
                    </div>
                    <Badge className={badgeClass(item.status)}>{item.status}</Badge>
                  </div>
                  <p className="mt-3 text-sm text-gray-600">{item.purpose}</p>
                  <p className="mt-2 text-sm text-gray-500">So nguoi: {item.attendees}</p>
                  {item.adminNote && <p className="mt-2 text-sm text-blue-600">Admin: {item.adminNote}</p>}
                  <Button variant="outline" size="sm" className="mt-4" onClick={() => openRoomEditor(item)}>
                    <PencilLine className="w-4 h-4 mr-2" />
                    Sua dat phong
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
      <Dialog open={Boolean(editor)} onOpenChange={(open) => !open && setEditor(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editor?.type === "schedule" && "Sua lich nhan su"}
              {editor?.type === "room" && "Sua dat phong"}
            </DialogTitle>
          </DialogHeader>

          {editor?.type === "schedule" && (
            <div className="space-y-4">
              <div>
                <Label>Ngay lam</Label>
                <Input value={String(formState.scheduleDate || "")} onChange={(event) => setFormState((current) => ({ ...current, scheduleDate: event.target.value }))} type="date" />
              </div>
              <div>
                <Label>Loai ca</Label>
                <Input value={String(formState.shiftLabel || "")} onChange={(event) => setFormState((current) => ({ ...current, shiftLabel: event.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Bat dau</Label>
                  <Input value={String(formState.startTime || "")} onChange={(event) => setFormState((current) => ({ ...current, startTime: event.target.value }))} type="time" />
                </div>
                <div>
                  <Label>Ket thuc</Label>
                  <Input value={String(formState.endTime || "")} onChange={(event) => setFormState((current) => ({ ...current, endTime: event.target.value }))} type="time" />
                </div>
              </div>
              <div>
                <Label>Trang thai</Label>
                <Select value={String(formState.status || "pending")} onValueChange={(value) => setFormState((current) => ({ ...current, status: value }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">pending</SelectItem>
                    <SelectItem value="approved">approved</SelectItem>
                    <SelectItem value="updated">updated</SelectItem>
                    <SelectItem value="cancelled">cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Ghi chu admin</Label>
                <Textarea value={String(formState.adminNote || "")} onChange={(event) => setFormState((current) => ({ ...current, adminNote: event.target.value }))} />
              </div>
            </div>
          )}

          {editor?.type === "room" && (
            <div className="space-y-4">
              <div>
                <Label>Phong</Label>
                <Input value={String(formState.roomName || "")} onChange={(event) => setFormState((current) => ({ ...current, roomName: event.target.value }))} />
              </div>
              <div>
                <Label>Ngay su dung</Label>
                <Input value={String(formState.bookingDate || "")} onChange={(event) => setFormState((current) => ({ ...current, bookingDate: event.target.value }))} type="date" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Bat dau</Label>
                  <Input value={String(formState.startTime || "")} onChange={(event) => setFormState((current) => ({ ...current, startTime: event.target.value }))} type="time" />
                </div>
                <div>
                  <Label>Ket thuc</Label>
                  <Input value={String(formState.endTime || "")} onChange={(event) => setFormState((current) => ({ ...current, endTime: event.target.value }))} type="time" />
                </div>
              </div>
              <div>
                <Label>So nguoi</Label>
                <Input value={String(formState.attendees || "")} onChange={(event) => setFormState((current) => ({ ...current, attendees: event.target.value }))} type="number" />
              </div>
              <div>
                <Label>Trang thai</Label>
                <Select value={String(formState.status || "pending")} onValueChange={(value) => setFormState((current) => ({ ...current, status: value }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">pending</SelectItem>
                    <SelectItem value="approved">approved</SelectItem>
                    <SelectItem value="updated">updated</SelectItem>
                    <SelectItem value="rejected">rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Ghi chu admin</Label>
                <Textarea value={String(formState.adminNote || "")} onChange={(event) => setFormState((current) => ({ ...current, adminNote: event.target.value }))} />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditor(null)}>Huy</Button>
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">Luu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
