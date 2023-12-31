"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
require('dotenv').config();
var config = {
    PORT: process.env.PORT || 4000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    JWT_SECRET: process.env.JWT_SECRET || 'Straing at the sky',
};
exports.config = config;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL25hdGhhbi9Eb2N1bWVudHMvYmVybGluLXZpZXdlci9hcGkvY29uZmlnLnRzIiwic291cmNlcyI6WyIvVXNlcnMvbmF0aGFuL0RvY3VtZW50cy9iZXJsaW4tdmlld2VyL2FwaS9jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBRTNCLElBQU0sTUFBTSxHQUFHO0lBQ2IsSUFBSSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLElBQUk7SUFDOUIsUUFBUSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxJQUFJLGFBQWE7SUFDL0MsVUFBVSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxJQUFJLG9CQUFvQjtDQUMzRCxDQUFDO0FBRU8sd0JBQU0iLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKCdkb3RlbnYnKS5jb25maWcoKTtcblxuY29uc3QgY29uZmlnID0ge1xuICBQT1JUOiBwcm9jZXNzLmVudi5QT1JUIHx8IDQwMDAsXG4gIE5PREVfRU5WOiBwcm9jZXNzLmVudi5OT0RFX0VOViB8fCAnZGV2ZWxvcG1lbnQnLFxuICBKV1RfU0VDUkVUOiBwcm9jZXNzLmVudi5KV1RfU0VDUkVUIHx8ICdTdHJhaW5nIGF0IHRoZSBza3knLFxufTtcblxuZXhwb3J0IHsgY29uZmlnIH07Il19