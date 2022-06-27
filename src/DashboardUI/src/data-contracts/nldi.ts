export enum Directions {
    None = 0,
    Upsteam = 1 << 0,
    Downsteam = 1 << 1
}

export enum DataPoints {
    None = 0,
    Wade = 1 << 0,
    Usgs = 1 << 1,
    Epa = 1 << 2
}