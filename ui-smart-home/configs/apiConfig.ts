export const BASE_URL = "https://strong-complete-sculpin.ngrok-free.app";
export const API_BASE_URL = `${BASE_URL}/api`;
const AUTH_BASE = `${API_BASE_URL}/auth`
const DEVICES_BASE = `${API_BASE_URL}/devices`;
const ACCESS_CONTROL_BASE = `${API_BASE_URL}/access-control`;
const USERS_BASE = `${API_BASE_URL}/users`
const GATEWAYS_BASE = `${API_BASE_URL}/gateways`
const GROUPS_BASE = `${API_BASE_URL}/groups`
const SCENES_BASE = `${API_BASE_URL}/scenes`
const SCENARIOS_BASE = `${API_BASE_URL}/scenarios`

export const API_ENDPOINTS = {
    auth: {
        login: `${AUTH_BASE}/login`,
        register: `${AUTH_BASE}/register`,
        refresh_token: `${AUTH_BASE}/refresh-token`,
    },
    users: {
        current_user: `${USERS_BASE}/me`,
        change_password: `${USERS_BASE}/change-password`,
        update: USERS_BASE,
        upload_avatar: `${USERS_BASE}/avatar`
    },
    devices: {
        by_owner: `${DEVICES_BASE}/owner`,
        by_access_control: `${DEVICES_BASE}/access-control`,
        detailed: (id: string) => `${DEVICES_BASE}/${id}`,
        update: (id: string) => `${DEVICES_BASE}/${id}`,
        delete: (id: string) => `${DEVICES_BASE}/${id}`,
        get_actions: (id: string) => `${DEVICES_BASE}/${id}/actions`
    },
    access_control: {
        grant: `${ACCESS_CONTROL_BASE}/grant`,
        detailed: (id: string) => `${ACCESS_CONTROL_BASE}/${id}`,
        by_owner: ACCESS_CONTROL_BASE,
        update: (id: string) => `${ACCESS_CONTROL_BASE}/grant/${id}`,
        revoke: `${ACCESS_CONTROL_BASE}/revoke`,
    },
    control: `${API_BASE_URL}/control`,
    gateways: {
        create: GATEWAYS_BASE,
        add_device: (id: string) => `${GATEWAYS_BASE}/${id}/devices`,
        by_user: `${GATEWAYS_BASE}/user`,
        detailed: (id: string) => `${GATEWAYS_BASE}/${id}`
    },
    groups: {
        create: GROUPS_BASE,
        all_groups: GROUPS_BASE,
        add_device: (id: string) => `${GROUPS_BASE}/${id}/devices/add`,
        remove_device: (id: string) => `${GROUPS_BASE}/${id}/devices/remove`,
        update: (id: string) => `${GROUPS_BASE}/${id}`,
        detailed: (id: string) => `${GROUPS_BASE}/${id}`,
        delete: (id: string) => `${GROUPS_BASE}/${id}`,
        update_icon: (id: string) => `${GROUPS_BASE}/${id}/icon`,
        get_devices_by_group: (id:string) => `${GROUPS_BASE}/${id}/devices`
    },
    scenes: {
        create: SCENES_BASE,
        by_owner: `${SCENES_BASE}/owner`,
        detailed: (id: string) => `${SCENES_BASE}/${id}`,
        update: (id: string) => `${SCENES_BASE}/${id}`,
        delete: (id: string) => `${SCENES_BASE}/${id}`,
        control: (id: string) => `${SCENES_BASE}/${id}/control`
    },
    scenarios: {
        create: SCENARIOS_BASE,
        by_owner: `${SCENARIOS_BASE}/owner`,
        detailed: (id: string) => `${SCENARIOS_BASE}/${id}`,
        update: (id: string) => `${SCENARIOS_BASE}/${id}`,
        delete: (id: string) => `${SCENARIOS_BASE}/${id}`
    },
};

export const API_CONFIG = {
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    timeout: 10000,
};
