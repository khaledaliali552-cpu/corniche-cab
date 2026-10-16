// نظام حفظ التقدم والفلوس في المتصفح LocalStorage
export class Save {
  constructor() {
    this.key = 'corniche_cab_save_v1';
    this.data = this.load();
  }

  load() {
    try {
      const raw = localStorage.getItem(this.key);
      if (raw) return JSON.parse(raw);
    } catch (e) {}

    // بيانات البداية
    return {
      money: 0,
      day: 1,
      carId: 'taxi_132',
      carColor: 0xffffff,
      ownedCars: ['taxi_132']
    };
  }

  save() {
    try {
      localStorage.setItem(this.key, JSON.stringify(this.data));
    } catch (e) {}
  }

  reset() {
    try {
      localStorage.removeItem(this.key);
    } catch (e) {}
    this.data = {
      money: 0,
      day: 1,
      carId: 'taxi_132',
      carColor: 0xffffff,
      ownedCars: ['taxi_132']
    };
  }
}

// تصدير دوال إضافية كاحتياط للتوافق
export function loadSave() {
  return new Save().data;
}

export function saveGame(data) {
  const s = new Save();
  s.data = data;
  s.save();
}
