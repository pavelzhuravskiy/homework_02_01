import { ObjectId } from "mongodb";
import { devicesRepository } from "../repositories/devices-repository";
import { jwtService } from "../application/jwt-service";
import { DeviceViewModel } from "../models/view/DeviceViewModel";
import { DeviceDBModel } from "../models/database/DeviceDBModel";

class DevicesService {
  async findDeviceById(deviceId: string): Promise<DeviceDBModel | null> {
    return devicesRepository.findDeviceById(deviceId);
  }

  async createDevice(
    newRefreshToken: string,
    ip: string,
    userAgent: string
  ): Promise<DeviceViewModel | null> {
    const newRefreshTokenObj = await jwtService.verifyToken(newRefreshToken);

    if (!newRefreshTokenObj) {
      return null;
    }

    const userId = newRefreshTokenObj.userId;
    const deviceId = newRefreshTokenObj.deviceId;
    const expirationDate = newRefreshTokenObj.exp;
    const issuedAt = newRefreshTokenObj.iat;

    const newDevice = new DeviceDBModel(
      new ObjectId(),
      ip,
      userAgent,
      userId.toString(),
      deviceId,
      issuedAt,
      expirationDate
    );

    return devicesRepository.createDevice(newDevice);
  }

  async updateDevice(
    ip: string,
    userId: string,
    issuedAt: number
  ): Promise<boolean> {
    return devicesRepository.updateDevice(ip, userId, issuedAt);
  }

  async deleteDevice(deviceId: string): Promise<boolean> {
    return devicesRepository.deleteDevice(deviceId);
  }

  async deleteAllOldDevices(currentDevice: string): Promise<boolean> {
    return devicesRepository.deleteAllOldDevices(currentDevice);
  }

  async deleteAll(): Promise<boolean> {
    return devicesRepository.deleteAll();
  }
}

export const devicesService = new DevicesService();