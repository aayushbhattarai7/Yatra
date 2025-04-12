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
Object.defineProperty(exports, "__esModule", { value: true });
exports.HotelRoomDTO = void 0;
const class_validator_1 = require("class-validator");
const enum_1 = require("../constant/enum");
class HotelRoomDTO {
  roomType;
  roomDescription;
  isAttachedBathroom;
  maxOccupancy;
  roomSize;
  Amenities;
  pricePerNight;
  isAvailable;
}
exports.HotelRoomDTO = HotelRoomDTO;
__decorate(
  [
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(enum_1.RoomType),
    __metadata("design:type", String),
  ],
  HotelRoomDTO.prototype,
  "roomType",
  void 0,
);
__decorate(
  [(0, class_validator_1.IsNotEmpty)(), __metadata("design:type", String)],
  HotelRoomDTO.prototype,
  "roomDescription",
  void 0,
);
__decorate(
  [(0, class_validator_1.IsNotEmpty)(), __metadata("design:type", Boolean)],
  HotelRoomDTO.prototype,
  "isAttachedBathroom",
  void 0,
);
__decorate(
  [(0, class_validator_1.IsNotEmpty)(), __metadata("design:type", Number)],
  HotelRoomDTO.prototype,
  "maxOccupancy",
  void 0,
);
__decorate(
  [(0, class_validator_1.IsNotEmpty)(), __metadata("design:type", Number)],
  HotelRoomDTO.prototype,
  "roomSize",
  void 0,
);
__decorate(
  [(0, class_validator_1.IsNotEmpty)(), __metadata("design:type", String)],
  HotelRoomDTO.prototype,
  "Amenities",
  void 0,
);
__decorate(
  [(0, class_validator_1.IsNotEmpty)(), __metadata("design:type", Number)],
  HotelRoomDTO.prototype,
  "pricePerNight",
  void 0,
);
__decorate(
  [(0, class_validator_1.IsNotEmpty)(), __metadata("design:type", Boolean)],
  HotelRoomDTO.prototype,
  "isAvailable",
  void 0,
);
