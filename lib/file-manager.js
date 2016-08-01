class FileManager {
	constructor( options = {} ) {
		this.fs = options.fs;
		if ( ! this.fs ) {
			throw new Error( 'FileManager must be created with a fs module' );
		}
	}

	doesFileExist( filePath ) {
		try {
			this.fs.accessSync( filePath );
		} catch ( e ) {
			return false;
		}
		return true;
	}

	doesDirExist( dirPath ) {
		return this.doesFileExist( dirPath );
	}

	getFileContents( filePath ) {
		return this.fs.readFileSync( filePath, 'utf8' );
	}

	ensureFile( filePath ) {
		this.fs.closeSync( this.fs.openSync( filePath, 'w' ) );
	}

	writeFile( filePath, content ) {
		if ( ! content ) {
			return this.ensureFile( filePath );
		}
		this.fs.writeFileSync( filePath, content, 'utf8' );
	}
}

export default FileManager;
