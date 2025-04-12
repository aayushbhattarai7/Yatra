"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const admin_entity_1 = require("../entities/admin/admin.entity");
const database_config_1 = require("../config/database.config");
const HttpException_utils_1 = __importDefault(require("../utils/HttpException.utils"));
const bcrypt_service_1 = __importDefault(require("./bcrypt.service"));
const guide_entity_1 = require("../entities/guide/guide.entity");
const travel_entity_1 = require("../entities/travels/travel.entity");
const enum_1 = require("../constant/enum");
const message_1 = require("../constant/message");
const mail_utils_1 = __importDefault(require("../utils/mail.utils"));
const user_entity_1 = require("../entities/user/user.entity");
const rating_entity_1 = require("../entities/ratings/rating.entity");
const RequestGuide_entities_1 = require("../entities/user/RequestGuide.entities");
const RequestTravels_entity_1 = require("../entities/user/RequestTravels.entity");
class AdminService {
    adminrepo;
    userRepo;
    guideRepo;
    travelRepo;
    ratingsRepo;
    guideRequestRepo;
    travelRequestRepo;
    constructor(adminrepo = database_config_1.AppDataSource.getRepository(admin_entity_1.Admin), userRepo = database_config_1.AppDataSource.getRepository(user_entity_1.User), guideRepo = database_config_1.AppDataSource.getRepository(guide_entity_1.Guide), travelRepo = database_config_1.AppDataSource.getRepository(travel_entity_1.Travel), ratingsRepo = database_config_1.AppDataSource.getRepository(rating_entity_1.Rating), guideRequestRepo = database_config_1.AppDataSource.getRepository(RequestGuide_entities_1.RequestGuide), travelRequestRepo = database_config_1.AppDataSource.getRepository(RequestTravels_entity_1.RequestTravel)) {
        this.adminrepo = adminrepo;
        this.userRepo = userRepo;
        this.guideRepo = guideRepo;
        this.travelRepo = travelRepo;
        this.ratingsRepo = ratingsRepo;
        this.guideRequestRepo = guideRequestRepo;
        this.travelRequestRepo = travelRequestRepo;
    }
    async login(data) {
        try {
            console.log("admin");
            const admin = await this.adminrepo.findOne({
                where: [{ email: data.email }],
                select: ["id", "email", "password", "role"],
            });
            console.log(admin);
            if (!admin)
                throw HttpException_utils_1.default.notFound("Invalid Email");
            const checkPassword = await bcrypt_service_1.default.compare(data.password, admin.password);
            if (!checkPassword)
                throw HttpException_utils_1.default.badRequest("Password didnot matched");
            return admin;
        }
        catch (error) {
            throw HttpException_utils_1.default.badRequest(error instanceof Error ? error.message : message_1.Message.error);
        }
    }
    async getAdmin(id) {
        try {
            const admin = await this.adminrepo.findOneBy({ id });
            return admin;
        }
        catch (error) {
            throw HttpException_utils_1.default.badRequest(error instanceof Error ? error.message : message_1.Message.error);
        }
    }
    async getGuideApprovalRequest(adminId) {
        try {
            const admin = await this.adminrepo.findOneBy({ id: adminId });
            if (!admin)
                throw HttpException_utils_1.default.unauthorized("You are not authorized admin");
            const getUnapprovedGuide = await this.guideRepo.find({
                where: {
                    approved: false,
                    verified: true,
                    approval: enum_1.Status.PENDING
                },
                relations: ["kyc", "details"],
            });
            if (!getUnapprovedGuide)
                throw HttpException_utils_1.default.notFound("Guide not found");
            return getUnapprovedGuide;
        }
        catch (error) {
            throw HttpException_utils_1.default.badRequest(error instanceof Error ? error.message : message_1.Message.error);
        }
    }
    async getTravelApprovalRequest(adminId) {
        try {
            const admin = await this.adminrepo.findOneBy({ id: adminId });
            if (!admin)
                throw HttpException_utils_1.default.unauthorized("You are not authorized admin");
            const getUnapprovedTravel = await this.travelRepo.find({
                where: {
                    approved: false,
                    verified: true,
                    approval: enum_1.Status.PENDING
                },
                relations: ["kyc", "details"],
            });
            console.log("🚀 ~ AdminService ~ getTravelApprovalRequest ~ getUnapprovedTravel:", getUnapprovedTravel);
            if (!getUnapprovedTravel)
                throw HttpException_utils_1.default.notFound("Travel not found");
            return getUnapprovedTravel;
        }
        catch (error) {
            throw HttpException_utils_1.default.badRequest(error instanceof Error ? error.message : message_1.Message.error);
        }
    }
    async approveTravel(adminId, travelId) {
        try {
            const admin = await this.adminrepo.findOneBy({ id: adminId });
            if (!admin)
                throw HttpException_utils_1.default.unauthorized("You are not authorized");
            console.log("aayo");
            const travel = await this.travelRepo.findOneBy({ id: travelId });
            if (!travel)
                throw HttpException_utils_1.default.notFound("Travel not found");
            console.log(adminId, "admin", travelId);
            const data = await this.travelRepo.update({ id: travelId, approved: false }, { approved: true, approval: enum_1.Status.ACCEPTED });
            await mail_utils_1.default.sendMail(travel.email, 'accepted');
            return "Travel Approved successfully";
        }
        catch (error) {
            throw HttpException_utils_1.default.badRequest(error instanceof Error ? error.message : message_1.Message.error);
        }
    }
    async approveGuide(adminId, guideId) {
        try {
            const admin = await this.adminrepo.findOneBy({ id: adminId });
            if (!admin)
                throw HttpException_utils_1.default.unauthorized("You are not authorized");
            const guide = await this.guideRepo.findOneBy({ id: guideId });
            if (!guide)
                throw HttpException_utils_1.default.notFound("Guide not found");
            await this.guideRepo.update({ id: guideId, approved: false }, { approved: true, approval: enum_1.Status.ACCEPTED });
            await mail_utils_1.default.sendMail(guide.email, 'accepted');
            return "Guide Approved successfully";
        }
        catch (error) {
            throw HttpException_utils_1.default.badRequest(error instanceof Error ? error.message : message_1.Message.error);
        }
    }
    async rejectGuide(adminId, guideId, message) {
        try {
            const admin = await this.adminrepo.findOneBy({ id: adminId });
            if (!admin)
                throw HttpException_utils_1.default.unauthorized("You are not authorized");
            const guide = await this.guideRepo.findOneBy({
                id: guideId,
                approved: false,
            });
            if (!guide)
                throw HttpException_utils_1.default.notFound("Guide not found");
            const update = await this.guideRepo.update({ id: guideId }, { approveStatus: message, approval: enum_1.Status.REJECTED });
            await mail_utils_1.default.sendMail(guide.email, 'rejected', message);
            return "Guide rejected successfully";
        }
        catch (error) {
            throw HttpException_utils_1.default.badRequest(error instanceof Error ? error.message : message_1.Message.error);
        }
    }
    async rejectTravel(adminId, travelId, message) {
        try {
            const admin = await this.adminrepo.findOneBy({ id: adminId });
            if (!admin)
                throw HttpException_utils_1.default.unauthorized("You are not authorized");
            const travel = await this.travelRepo.findOneBy({
                id: travelId,
                approved: false,
            });
            if (!travel)
                throw HttpException_utils_1.default.notFound("Travel not found");
            await this.travelRepo.update({ id: travelId }, { approveStatus: message, approval: enum_1.Status.REJECTED });
            await mail_utils_1.default.sendMail(travel.email, 'rejected', travel.approveStatus);
            return "Travel rejected rejected";
        }
        catch (error) {
            throw HttpException_utils_1.default.badRequest(error instanceof Error ? error.message : message_1.Message.error);
        }
    }
    async getAllUsers() {
        try {
            const travels = await this.userRepo.find({ relations: ["image"] });
            if (travels.length === 0)
                throw HttpException_utils_1.default.notFound("Travels not found");
            return travels;
        }
        catch (error) {
            throw HttpException_utils_1.default.badRequest(error instanceof Error ? error.message : message_1.Message.error);
        }
    }
    async getAllTravels() {
        try {
            const users = await this.travelRepo.find({ relations: ["kyc", "details"] });
            if (users.length === 0)
                throw HttpException_utils_1.default.notFound("Travels not found");
            return users;
        }
        catch (error) {
            throw HttpException_utils_1.default.badRequest(error instanceof Error ? error.message : message_1.Message.error);
        }
    }
    async getAllGuides() {
        try {
            const guides = await this.guideRepo.find({ relations: ["kyc", "details"] });
            if (guides.length === 0)
                throw HttpException_utils_1.default.notFound("Guides not found");
            return guides;
        }
        catch (error) {
            throw HttpException_utils_1.default.badRequest(error instanceof Error ? error.message : message_1.Message.error);
        }
    }
    async getHighestRatingGuides() {
        try {
            const guides = await this.guideRepo.find({
                relations: ["ratings", "kyc", "details"],
            });
            if (!guides.length) {
                throw HttpException_utils_1.default.notFound("Guides not found");
            }
            const guidesWithRating = guides.map((guide) => {
                const totalRatings = guide.ratings?.reduce((sum, r) => sum + r.rating, 0) || 0;
                const avgRating = guide.ratings?.length
                    ? parseFloat((totalRatings / guide.ratings.length).toFixed(2))
                    : 0;
                return {
                    ...guide,
                    averageRating: avgRating,
                };
            });
            const topGuides = guidesWithRating
                .sort((a, b) => b.averageRating - a.averageRating)
                .slice(0, 3);
            return topGuides;
        }
        catch (error) {
            throw HttpException_utils_1.default.badRequest(error instanceof Error ? error.message : "Something went wrong");
        }
    }
    async getHighestRatingTravels() {
        try {
            const travels = await this.travelRepo.find({
                relations: ["ratings", "kyc", "details"],
            });
            if (!travels.length) {
                throw HttpException_utils_1.default.notFound("Travel not found");
            }
            const travelsWithRating = travels.map((travel) => {
                const totalRatings = travel.ratings?.reduce((sum, r) => sum + r.rating, 0) || 0;
                const avgRating = travel.ratings?.length
                    ? parseFloat((totalRatings / travel.ratings.length).toFixed(2))
                    : 0;
                return {
                    ...travel,
                    averageRating: avgRating,
                };
            });
            const topTravels = travelsWithRating
                .sort((a, b) => b.averageRating - a.averageRating)
                .slice(0, 3);
            return topTravels;
        }
        catch (error) {
            throw HttpException_utils_1.default.badRequest(error instanceof Error ? error.message : "Something went wrong");
        }
    }
    async getTotalRevenue() {
        try {
            const completedTravelRequests = await this.travelRequestRepo.find({
                where: { status: enum_1.RequestStatus.COMPLETED },
                select: ["price"],
            });
            const completedGuideRequests = await this.guideRequestRepo.find({
                where: { status: enum_1.RequestStatus.COMPLETED },
                select: ["price"],
            });
            const allPrices = [
                ...completedTravelRequests.map((req) => parseFloat(req.price)),
                ...completedGuideRequests.map((req) => parseFloat(req.price)),
            ];
            const totalRevenue = allPrices.reduce((sum, price) => sum + price, 0);
            return parseFloat(totalRevenue.toFixed(2));
        }
        catch (error) {
            throw HttpException_utils_1.default.badRequest(error instanceof Error ? error.message : "Failed to fetch revenue");
        }
    }
    async getGroupedRevenue() {
        const completedTravelRequests = await this.travelRequestRepo.find({ where: { status: enum_1.RequestStatus.COMPLETED } });
        const completedGuideRequests = await this.guideRequestRepo.find({ where: { status: enum_1.RequestStatus.COMPLETED } });
        const allRequests = [...completedTravelRequests, ...completedGuideRequests];
        const daily = {};
        const weekly = {};
        const monthly = {};
        const yearly = {};
        allRequests.forEach((req) => {
            const date = new Date(req.updatedAt);
            const price = parseFloat(req.price);
            const day = date.toISOString().split('T')[0];
            const week = `${this.getStartOfWeek(date)} to ${this.getEndOfWeek(date)}`;
            const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            const year = String(date.getFullYear());
            daily[day] = (daily[day] || 0) + price;
            weekly[week] = (weekly[week] || 0) + price;
            monthly[month] = (monthly[month] || 0) + price;
            yearly[year] = (yearly[year] || 0) + price;
        });
        return {
            daily: Object.entries(daily).map(([name, revenue]) => ({ name, revenue })),
            weekly: Object.entries(weekly).map(([name, revenue]) => ({ name, revenue })),
            monthly: Object.entries(monthly).map(([name, revenue]) => ({ name, revenue })),
            yearly: Object.entries(yearly).map(([name, revenue]) => ({ name, revenue })),
        };
    }
    getStartOfWeek(date) {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        const monday = new Date(d.setDate(diff));
        return monday.toISOString().split('T')[0];
    }
    getEndOfWeek(date) {
        const start = new Date(this.getStartOfWeek(date));
        const sunday = new Date(start);
        sunday.setDate(start.getDate() + 6);
        return sunday.toISOString().split('T')[0];
    }
}
exports.default = new AdminService();
