const loadImage = async (url: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject('Error loading image: ${url}');
        img.src = url;
    })
}

export { loadImage };