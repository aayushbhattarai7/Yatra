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
Object.defineProperty(exports, "__esModule", { value: true });
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const crypto_1 = require("crypto");
let Base = class Base extends typeorm_1.BaseEntity {
    id;
    createdAt;
    updatedAt;
    deletedAt;
    generateUUID() {
        this.id = (0, crypto_1.randomUUID)();
    }
};
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.ID),
    (0, typeorm_1.Column)({ name: "id", primary: true, type: "uuid" }),
    __metadata("design:type", String)
], Base.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Date),
    (0, typeorm_1.CreateDateColumn)({ name: "created-at", type: "timestamp with time zone" }),
    __metadata("design:type", Date)
], Base.prototype, "createdAt", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Date),
    (0, typeorm_1.UpdateDateColumn)({ name: "updated_at" }),
    __metadata("design:type", Date)
], Base.prototype, "updatedAt", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    (0, typeorm_1.DeleteDateColumn)({ name: "deleted_at" }),
    __metadata("design:type", String)
], Base.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Base.prototype, "generateUUID", null);
Base = __decorate([
    (0, type_graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)()
], Base);
exports.default = Base;
