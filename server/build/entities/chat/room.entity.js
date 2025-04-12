"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Room = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = __importDefault(require("../../entities/base.entity"));
const chat_entity_1 = require("./chat.entity");
const user_entity_1 = require("../../entities/user/user.entity");
const guide_entity_1 = require("../../entities/guide/guide.entity");
const travel_entity_1 = require("../../entities/travels/travel.entity");
const type_graphql_1 = require("type-graphql");
let Room = class Room extends base_entity_1.default {
    user;
    guide;
    travel;
    chat;
};
exports.Room = Room;
__decorate([
    (0, type_graphql_1.Field)(() => user_entity_1.User),
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.users, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "user_id" }),
    __metadata("design:type", user_entity_1.User)
], Room.prototype, "user", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => guide_entity_1.Guide, { nullable: true }),
    (0, typeorm_1.ManyToOne)(() => guide_entity_1.Guide, (guide) => guide.guides, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "guide_id" }),
    __metadata("design:type", guide_entity_1.Guide)
], Room.prototype, "guide", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => travel_entity_1.Travel, { nullable: true }),
    (0, typeorm_1.ManyToOne)(() => travel_entity_1.Travel, (travel) => travel.travels, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "travel_id" }),
    __metadata("design:type", travel_entity_1.Travel)
], Room.prototype, "travel", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [chat_entity_1.Chat]),
    (0, typeorm_1.OneToMany)(() => chat_entity_1.Chat, (chat) => chat.room, { cascade: true }),
    __metadata("design:type", Array)
], Room.prototype, "chat", void 0);
exports.Room = Room = __decorate([
    (0, type_graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)("room")
], Room);
