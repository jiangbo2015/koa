export const response = (success, data, message) => {
	if (success) {
		return {
			success: true,
			data,
			message: message || "操作成功"
		}
	} else {
		return {
			success: false,
			data,
			message: message || "操作失败"
		}
	}
}
