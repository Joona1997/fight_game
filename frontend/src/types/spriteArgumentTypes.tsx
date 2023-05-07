export type Position ={
    x: number,
    y: number
}

export type Velocity = {
    x: number,
    y: number
}

export type AttackBox = {
    position: Position,
    width: number,
    height: number,
    offset: {x: number,},
}

export type HealthBar = {
    x: number,
    y: number,
}

export type newLoc = {
    position: Position,
    width: number,
    height: number
}