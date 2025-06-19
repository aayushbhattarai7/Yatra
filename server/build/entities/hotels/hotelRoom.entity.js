"use strict";
var __decorate =
  (this && this.__decorate) ||
  function (decorators, target, key, desc) {
    var c = arguments.length,
      r =
        c < 3
          ? target
          : desc === null
            ? (desc = Object.getOwnPropertyDescriptor(target, key))
            : desc,
      d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i]))
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
var __metadata =
  (this && this.__metadata) ||
  function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
      return Reflect.metadata(k, v);
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.HotelRoom = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = __importDefault(require("../base.entity"));
const enum_1 = require("../../constant/enum");
let HotelRoom = class HotelRoom extends base_entity_1.default {
  roomType;
  roomDescription;
  isAttachedBathroom;
  maxOccupancy;
  roomSize;
  Amenities;
  pricePerNight;
  isAvailable;
};
exports.HotelRoom = HotelRoom;
__decorate(
  [
    (0, typeorm_1.Column)({ type: "enum", enum: enum_1.RoomType }),
    __metadata("design:type", String),
  ],
  HotelRoom.prototype,
  "roomType",
  void 0,
);
__decorate(
  [
    (0, typeorm_1.Column)({ name: "room_description" }),
    __metadata("design:type", String),
  ],
  HotelRoom.prototype,
  "roomDescription",
  void 0,
);
__decorate(
  [
    (0, typeorm_1.Column)({ name: "is_Attached_bathroom" }),
    __metadata("design:type", Boolean),
  ],
  HotelRoom.prototype,
  "isAttachedBathroom",
  void 0,
);
__decorate(
  [
    (0, typeorm_1.Column)({ name: "max_occupancy" }),
    __metadata("design:type", Number),
  ],
  HotelRoom.prototype,
  "maxOccupancy",
  void 0,
);
__decorate(
  [
    (0, typeorm_1.Column)({ name: "room_size" }),
    __metadata("design:type", Number),
  ],
  HotelRoom.prototype,
  "roomSize",
  void 0,
);
__decorate(
  [
    (0, typeorm_1.Column)({ name: "amenities" }),
    __metadata("design:type", String),
  ],
  HotelRoom.prototype,
  "Amenities",
  void 0,
);
__decorate(
  [
    (0, typeorm_1.Column)({ name: "price_per_night" }),
    __metadata("design:type", Number),
  ],
  HotelRoom.prototype,
  "pricePerNight",
  void 0,
);
__decorate(
  [
    (0, typeorm_1.Column)({ name: "is_available" }),
    __metadata("design:type", Boolean),
  ],
  HotelRoom.prototype,
  "isAvailable",
  void 0,
);
exports.HotelRoom = HotelRoom = __decorate(
  [(0, typeorm_1.Entity)("hotel_room")],
  HotelRoom,
);
