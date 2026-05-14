import axios from "axios";
import jwtDefaultConfig from "./jwtDefaultConfig";

class JwtService {
  jwtConfig = { ...jwtDefaultConfig };

  isAlreadyFetchingAccessToken = false;

  subscribers = [];

  constructor() {
    // ── Request interceptor ───────────────────────────────────────────────────
    axios.interceptors.request.use(
      (config) => {
        const accessToken = this.getToken();

        if (accessToken) {
          config.headers.Authorization = `${this.jwtConfig.tokenType} ${accessToken}`;
        }

        if (config.url.includes("update-profile")) {
          config.headers["Content-Type"] = "multipart/form-data";
        } else if (
          config.method === "post" &&
          config.url.replaceAll("/", "").endsWith("expense")
        ) {
          config.headers["Content-Type"] = "multipart/form-data";
        } else {
          config.headers["Content-Type"] = "application/json";
        }
        config.headers["Access-Control-Allow-Origin"] = "*";
        return config;
      },
      (error) => Promise.reject(error)
    );

    // ── Response interceptor — auto refresh on 401 ────────────────────────────
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        const { config: originalRequest, response } = error;

        // Sirf 401 handle karo — refresh/logout loop avoid karo
        if (
          response?.status === 401 &&
          !originalRequest._retry &&
          !originalRequest.url?.includes(this.jwtConfig.refreshEndpoint) &&
          !originalRequest.url?.includes(this.jwtConfig.logoutEndpoint) &&
          !originalRequest.url?.includes(this.jwtConfig.loginEndpoint)
        ) {
          if (this.isAlreadyFetchingAccessToken) {
            return new Promise((resolve) => {
              this.addSubscriber((newToken) => {
                originalRequest.headers.Authorization = `${this.jwtConfig.tokenType} ${newToken}`;
                resolve(axios(originalRequest));
              });
            });
          }

          // Agar refresh token hi nahi hai tو loop mat karo
          if (!this.getRefreshToken()) {
            return Promise.reject(error);
          }

          originalRequest._retry = true;
          this.isAlreadyFetchingAccessToken = true;

          return axios
            .post(this.jwtConfig.refreshEndpoint, {
              refreshToken: this.getRefreshToken(),
            })
            .then((res) => {
              const newAccessToken = res.data.tokens.access.token;
              const newRefreshToken = res.data.tokens.refresh.token;

              this.setToken(newAccessToken);
              this.setRefreshToken(newRefreshToken);
              this.isAlreadyFetchingAccessToken = false;
              this.onAccessTokenFetched(newAccessToken);

              originalRequest.headers.Authorization = `${this.jwtConfig.tokenType} ${newAccessToken}`;
              return axios(originalRequest);
            })
            .catch(() => {
              // Refresh bhi fail — logout karo
              this.isAlreadyFetchingAccessToken = false;
              this.removeToken();
              this.removeRefreshtoken();
              this.removeUser();
              this.setIsLogin(false);
              window.location.replace('/login');
              return Promise.reject(error);
            });
        }

        return Promise.reject(error);
      }
    );
  }

  onAccessTokenFetched(accessToken) {
    this.subscribers = this.subscribers.filter((callback) =>
      callback(accessToken)
    );
  }

  addSubscriber(callback) {
    this.subscribers.push(callback);
  }

  setIsLogin(check) {
    localStorage.setItem(this.jwtConfig.storageIsLoginKeyName, check);
  }

  getIsLogin() {
    const isLogin = localStorage.getItem(this.jwtConfig.storageIsLoginKeyName);
    if (isLogin && (isLogin === true || isLogin === "true")) return true;
    else return false;
  }

  removeIsLogin() {
    localStorage.removeItem(this.jwtConfig.storageIsLoginKeyName);
  }

  setToken(value) {
    localStorage.setItem(this.jwtConfig.storageTokenKeyName, value);
  }

  getToken() {
    return localStorage.getItem(this.jwtConfig.storageTokenKeyName);
  }

  removeToken() {
    localStorage.removeItem(this.jwtConfig.storageTokenKeyName);
  }

  setRefreshToken(value) {
    localStorage.setItem(this.jwtConfig.storageRefreshTokenKeyName, value);
  }

  getRefreshToken() {
    return localStorage.getItem(this.jwtConfig.storageRefreshTokenKeyName);
  }

  removeRefreshtoken() {
    localStorage.removeItem(this.jwtConfig.storageRefreshTokenKeyName);
  }

  setUser(value) {
    localStorage.setItem(
      this.jwtConfig.storageUserKeyName,
      JSON.stringify(value)
    );
  }

  getUser() {
    return JSON.parse(localStorage.getItem(this.jwtConfig.storageUserKeyName));
  }

  removeUser() {
    localStorage.removeItem(this.jwtConfig.storageUserKeyName);
  }

  login(args) {
    return axios.post(this.jwtConfig.loginEndpoint, args);
  }

  // Fresh user + permissions fetch — AppContextContainer uses this on route change
  getMe() {
    return axios.get(this.jwtConfig.meEndpoint);
  }

  updatePassword(args) {
    return axios.post(this.jwtConfig.updatePasswordEndpoint, args);
  }

  resetPassword(args) {
    return axios.post(this.jwtConfig.resetPasswordEndpoint, args);
  }

  logout() {
    return axios.post(this.jwtConfig.logoutEndpoint, {
      refreshToken: this.getRefreshToken(),
    });
  }

  refreshToken() {
    return axios.post(this.jwtConfig.refreshEndpoint, {
      refreshToken: this.getRefreshToken(),
    });
  }

  createIsp(payload) {
    return axios.post(this.jwtConfig.ispEndpoint, payload);
  }

  editIsp(id, payload) {
    return axios.patch(`${this.jwtConfig.ispEndpoint}/${id}`, payload);
  }

  updateProfile(args) {
    return axios.post(`${this.jwtConfig.updateProfileEndpoint}`, args);
  }

  getAllIsps() {
    return axios.get(this.jwtConfig.ispEndpoint);
  }

  getIspById(id) {
    return axios.get(`${this.jwtConfig.ispEndpoint}/${id}`);
  }

  createPackage(payload) {
    return axios.post(this.jwtConfig.packageEndpoint, payload);
  }

  getAllPackages(isp) {
    return axios.get(`${this.jwtConfig.packageEndpoint}/by-isp/${isp}`);
  }

  updatePackage(id, payload) {
    return axios.patch(`${this.jwtConfig.packageEndpoint}/${id}`, payload);
  }

  deletePackage(id) {
    return axios.delete(`${this.jwtConfig.packageEndpoint}/${id}`);
  }

  createUser(payload) {
    return axios.post(this.jwtConfig.userEndpoint, payload);
  }

  editUser(id, payload) {
    return axios.patch(`${this.jwtConfig.userEndpoint}/${id}`, payload);
  }

  getAllUsers() {
    return axios.get(this.jwtConfig.userEndpoint);
  }

  getAutoCompleteUsers(userId) {
    return axios.post(`${this.jwtConfig.userEndpoint}/autocomplete`, {
      userId,
    });
  }

  deleteUser(id) {
    return axios.delete(`${this.jwtConfig.userEndpoint}/${id}`);
  }

  createEntry(payload) {
    return axios.post(this.jwtConfig.entryEndpoint, payload);
  }

  updateEntry(id, payload) {
    return axios.patch(`${this.jwtConfig.entryEndpoint}/${id}`, payload);
  }

  deleteEntry(id) {
    return axios.delete(`${this.jwtConfig.entryEndpoint}/${id}`);
  }

  getEntryById(id) {
    return axios.get(`${this.jwtConfig.entryEndpoint}/${id}`);
  }

  getAllCompletedEntries(payload) {
    return axios.post(`${this.jwtConfig.entryEndpoint}/completed`, payload);
  }

  getAllPendingEntries() {
    return axios.get(`${this.jwtConfig.entryEndpoint}/pending`);
  }

  getAllPendingEntriesWithinDateRange(payload) {
    return axios.post(`${this.jwtConfig.entryEndpoint}/pending`, payload);
  }

  addStaff(payload) {
    return axios.post(this.jwtConfig.staffEndpoint, payload);
  }

  getAllStaffs() {
    return axios.get(this.jwtConfig.staffEndpoint);
  }
  updateStaff(id, payload) {
    return axios.patch(`${this.jwtConfig.staffEndpoint}/${id}`, payload);
  }

  deleteStaff(id) {
    return axios.delete(`${this.jwtConfig.staffEndpoint}/${id}`);
  }

  getAllPartners() {
    return axios.get(`${this.jwtConfig.staffEndpoint}/getAllPartners`);
  }

  createInvoice(payload) {
    return axios.post(this.jwtConfig.invoiceEndpoint, payload);
  }

  getSentInvoices(payload) {
    return axios.post(
      `${this.jwtConfig.invoiceEndpoint}/sent-invoices`,
      payload
    );
  }

  getAllInvoices(payload) {
    return axios.post(
      `${this.jwtConfig.invoiceEndpoint}/all-invoices`,
      payload
    );
  }

  deleteInvoice(id) {
    return axios.delete(`${this.jwtConfig.invoiceEndpoint}/${id}`);
  }

  createExpense(payload) {
    return axios.post(this.jwtConfig.expenseEndpoint, payload);
  }

  getCompletedExpenses(payload) {
    return axios.post(`${this.jwtConfig.expenseEndpoint}/completed`, payload);
  }

  getPendingExpenses(payload) {
    return axios.post(`${this.jwtConfig.expenseEndpoint}/pending`, payload);
  }

  approveExpense(id) {
    return axios.get(`${this.jwtConfig.expenseEndpoint}/approve/${id}`);
  }

  deleteExpense(id) {
    return axios.delete(`${this.jwtConfig.expenseEndpoint}/${id}`);
  }

  reverseExpense(id) {
    return axios.get(`${this.jwtConfig.expenseEndpoint}/reverse/${id}`);
  }

  reviveExpense(id) {
    return axios.get(`${this.jwtConfig.expenseEndpoint}/revive/${id}`);
  }

  getSummary(payload) {
    return axios.post(this.jwtConfig.summaryEndpoint, payload);
  }

  sendServerDownAlert(id) {
    return axios.get(`${this.jwtConfig.ispEndpoint}/server-down-alert/${id}`);
  }

  sendServerUpAlert(id) {
    return axios.get(`${this.jwtConfig.ispEndpoint}/server-up-alert/${id}`);
  }

  sendCustomMessage(payload) {
    return axios.post(
      `${this.jwtConfig.userEndpoint}/send-custom-message`,
      payload
    );
  }

  updateSmsSending(payload) {
    return axios.post(this.jwtConfig.smsSendingEndpoint, payload);
  }

  getSmsSending() {
    return axios.get(this.jwtConfig.smsSendingEndpoint);
  }

  getSmsBalance() {
    return axios.get(`${this.jwtConfig.smsSendingEndpoint}/sms-balance`);
  }

  sendExpiryAlert() {
    return axios.get(`${this.jwtConfig.summaryEndpoint}/send-expiry-alert`);
  }

  createExtraIncome(payload) {
    return axios.post(this.jwtConfig.extraIncomeEndpoint, payload);
  }

  getAllCompletedExtraIncome(payload) {
    return axios.post(
      `${this.jwtConfig.extraIncomeEndpoint}/completed`,
      payload
    );
  }

  getAllPendingExtraIncome(payload) {
    return axios.post(`${this.jwtConfig.extraIncomeEndpoint}/pending`, payload);
  }

  updateExtraIncome(id, payload) {
    return axios.patch(`${this.jwtConfig.extraIncomeEndpoint}/${id}`, payload);
  }

  deleteExtraIncome(id) {
    return axios.delete(`${this.jwtConfig.extraIncomeEndpoint}/${id}`);
  }

  // ─── Organization ────────────────────────────────────────────────
  createOrganization(payload) {
    return axios.post(this.jwtConfig.organizationEndpoint, payload);
  }

  getAllOrganizations() {
    return axios.get(this.jwtConfig.organizationEndpoint);
  }

  // NEW —  for EditOrganization
  getOrganization(id) {
    return axios.get(`${this.jwtConfig.organizationEndpoint}/${id}`);
  }
  // getOrganizationById(id) {
  //   return axios.get(`${this.jwtConfig.organizationEndpoint}/${id}`);
  // }
  getOrganizationById(id) {
    return axios.get(`${this.jwtConfig.organizationEndpoint}/${id}`);
}
  
  updateOrganization(id, payload) {
    return axios.put(`${this.jwtConfig.organizationEndpoint}/${id}`, payload);
  }
 
  updateOrganizationStatus(id, status) {
    return axios.patch(`${this.jwtConfig.organizationEndpoint}/${id}/status`, { status });
  }

  updateOrganizationFeatures(id, features) {
    return axios.patch(`${this.jwtConfig.organizationEndpoint}/${id}/features`, { features });
  }

  deleteOrganization(id) {
    return axios.delete(`${this.jwtConfig.organizationEndpoint}/${id}`);
  }

  // Logo: base64 string as JSON — backend reads req.body.logo
  uploadOrgLogo(id, base64Logo) {
    return axios.patch(`${this.jwtConfig.organizationEndpoint}/${id}/logo`, { logo: base64Logo });
  }
  // ──── Role Methods ────────────────────────────────────────
  
  getAllRoles() { 
    return axios.get(this.jwtConfig.roleEndpoint);
  }
  // Sirf custom DB roles — system roles nahi (staff assign dropdown ke liye)
  getCustomRoles() {
    return axios.get(`${this.jwtConfig.roleEndpoint}/custom-only`);
  }
  createRole(payload) { 
    return axios.post(this.jwtConfig.roleEndpoint, payload); 
  }
  deleteRole(id) { 
    return axios.delete(`${this.jwtConfig.roleEndpoint}/${id}`); 
  }
  getRoleById(id) { 
    return axios.get(`${this.jwtConfig.roleEndpoint}/${id}`); 
  }
  updateRole(id, payload) { 
    return axios.put(`${this.jwtConfig.roleEndpoint}/${id}`, payload); 
  }
  

}

const jwt = new JwtService();
export default jwt;