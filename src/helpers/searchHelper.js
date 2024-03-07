import PhotoService from "@/services/PhotoService";

class SearchHelper {
  constructor({ token, accountId, searchString }) {
    this.token = token;
    this.accountId = accountId;
    this, (this.searchString = searchString);
  }

  photos() {
    const UTDPhotoService = new PhotoService(this.token);
    return UTDPhotoService.searchPhotos(this.searchString, this.accountId);
  }

  albums() {
    const UTDPhotoService = new PhotoService(this.token);
  }
}

export default SearchHelper;
