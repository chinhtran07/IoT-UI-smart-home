// GrantPermissionRequest - Cấp quyền cho người dùng
export interface GrantPermissionRequest {
    userId: string;           // ID của người dùng mà bạn muốn cấp quyền
    permissions: string[];    // Danh sách quyền cần cấp (ví dụ: "read", "write", "all")
}

// GetAccessControlRequest - Lấy thông tin quyền của người dùng
export interface GetAccessControlRequest {
    userId: string;          // ID của người dùng mà bạn muốn lấy thông tin quyền
}

// UpdateAccessControlRequest - Cập nhật quyền của người dùng
export interface UpdateAccessControlRequest {
    userId: string;          // ID của người dùng mà bạn muốn cập nhật quyền
    permissions: string[];    // Danh sách quyền mới cần cập nhật
}

// GrantedUser - Thông tin người dùng được cấp quyền
export interface GrantedUser {
    userId: string;          // ID của người dùng được cấp quyền
    permissions: string[];    // Danh sách quyền đã được cấp
}

// GetGrantedUsersByOwnerResponse - Phản hồi danh sách người dùng được cấp quyền
export interface GetGrantedUsersByOwnerResponse {
    users: GrantedUser[];    // Danh sách người dùng được cấp quyền
}

// ControlDeviceRequest - Request để điều khiển thiết bị
export interface ControlDeviceRequest {
    deviceId: string; // ID của thiết bị cần điều khiển
    command: {
        [key: string]: string | number | boolean; // Lệnh để điều khiển thiết bị
    }
}

// CreateGatewayRequest - Request để tạo gateway
export interface CreateGatewayRequest {
    name: string; // Tên của gateway
    ipAddress: string; // Địa chỉ IP của gateway
    macAddress: string; // Địa chỉ MAC của gateway
    status: boolean; // Trạng thái của gateway (có hoạt động hay không)
}

// Trigger - Định nghĩa trigger cho scenario
export interface Trigger {
    type: "time" | "device"; // Kiểu trigger, có thể là "time" hoặc "device"
    startTime?: string; // Thời gian bắt đầu (nếu loại là "time")
    endTime?: string; // Thời gian kết thúc (nếu loại là "time")
    deviceId?: string; // ID của thiết bị (nếu loại là "device")
    // Có thể thêm các thuộc tính khác nếu cần
}

// CreateScenarioRequest - Request để tạo scenario
export interface CreateScenarioRequest {
    name: string; // Tên của scenario
    isEnabled: boolean; // Trạng thái kích hoạt của scenario
    triggers: Trigger[]; // Mảng các trigger
    conditions?: any[]; // Mảng các điều kiện (có thể định nghĩa riêng nếu cần)
    actions: string[]; // Mảng các ID hành động
}
