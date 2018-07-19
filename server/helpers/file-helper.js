
export default class FileHelper {

	static checkImageExtension (fileExtension) {
		const imageExtensions = ['png', 'jpg', 'jpeg'];
		return imageExtensions.includes(fileExtension);
	}

}