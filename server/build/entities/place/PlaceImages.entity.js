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
const typeorm_1 = require("typeorm");
const type_graphql_1 = require("type-graphql");
const base_entity_1 = __importDefault(require("../../entities/base.entity"));
const enum_1 = require("../../constant/enum");
const trekkingplace_entity_1 = require("./trekkingplace.entity");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const path_utils_1 = require("../../utils/path.utils");
const env_config_1 = require("../../config/env.config");
(0, type_graphql_1.registerEnumType)(enum_1.MediaType, {
  name: "MediaType",
});
let PlaceImage = class PlaceImage extends base_entity_1.default {
  name;
  mimetype;
  type;
  TrekkingPlace;
  path;
  transferImageToUpload(id, type) {
    const TEMP_PATH = path_1.default.join(
      (0, path_utils_1.getTempFolderPathForPlace)(),
      this.name,
    );
    const UPLOAD_PATH = path_1.default.join(
      (0, path_utils_1.getUploadFolderpathForplace)(),
      type.toLowerCase(),
      this.id.toString(),
    );
    !fs_1.default.existsSync(UPLOAD_PATH) &&
      fs_1.default.mkdirSync(UPLOAD_PATH, { recursive: true });
    fs_1.default.renameSync(
      TEMP_PATH,
      path_1.default.join(UPLOAD_PATH, this.name),
    );
  }
  async loadImagePath() {
    this.path = `${env_config_1.DotenvConfig.BASE_URL}/${this.type.toLowerCase()}/${this.id.toString()}/${this.name}`;
  }
};
__decorate(
  [
    (0, type_graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String),
  ],
  PlaceImage.prototype,
  "name",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)({ nullable: true }),
    (0, typeorm_1.Column)({ name: "mimetype", nullable: true }),
    __metadata("design:type", String),
  ],
  PlaceImage.prototype,
  "mimetype",
  void 0,
);
__decorate(
  [
    (0, type_graphql_1.Field)(() => enum_1.MediaType),
    (0, typeorm_1.Column)({ enum: enum_1.MediaType, type: "enum" }),
    __metadata("design:type", String),
  ],
  PlaceImage.prototype,
  "type",
  void 0,
);
__decorate(
  [
    (0, typeorm_1.ManyToOne)(
      () => trekkingplace_entity_1.TrekkingPlace,
      (TrekkingPlace) => TrekkingPlace.images,
      {
        onDelete: "CASCADE",
      },
    ),
    (0, typeorm_1.JoinColumn)({ name: "TrekkingPlace_id" }),
    __metadata("design:type", trekkingplace_entity_1.TrekkingPlace),
  ],
  PlaceImage.prototype,
  "TrekkingPlace",
  void 0,
);
__decorate(
  [(0, type_graphql_1.Field)(), __metadata("design:type", String)],
  PlaceImage.prototype,
  "path",
  void 0,
);
__decorate(
  [
    (0, typeorm_1.AfterLoad)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise),
  ],
  PlaceImage.prototype,
  "loadImagePath",
  null,
);
PlaceImage = __decorate(
  [(0, type_graphql_1.ObjectType)(), (0, typeorm_1.Entity)("placesImages")],
  PlaceImage,
);
exports.default = PlaceImage;
