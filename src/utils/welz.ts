import { vec, Vector } from "excalibur";


export class Circle {
    public readonly Position: Vector;
    public readonly Radius: number;
    constructor(position: Vector, radius: number) {
        this.Position = position;
        this.Radius = radius;
    }

    public Contains(point: Vector): boolean {
        return point.distance(this.Position) < this.Radius;
    }
}

function trivial(R: [] | [Vector] | [Vector, Vector] | [Vector, Vector, Vector]): Circle | undefined {
    if (R.length == 0) {
        return undefined;
    }

    if (R.length == 1) {
        return new Circle(R[0], 0);
    }

    if (R.length == 2) {
        const distanceToMiddle = R[0].sub(R[1]);
        const middle = R[0].add(distanceToMiddle);
        return new Circle(middle, distanceToMiddle.distance());
    }

    const [A, B, C] = R;
    const a = B.sub(C).distance();
    const b = A.sub(C).distance();
    const c = B.sub(A).distance();

    const Â = 1 / 4 * Math.sqrt(4 * a * a * b * b - Math.pow(a * a + b * b - c * c, 2));
    const radius = a * b * c / (4 * Â);
    const d = 2 * (A.x * (B.y - C.y) + B.x * (C.y - A.y) + C.x * (A.y - B.y));
    const middle = vec(
        ((A.x * A.x + A.y * A.y) * (B.y - C.y) + (B.x * B.x + B.y * B.y) * (C.y - A.y) + (C.x * C.x + C.y * C.y) * (A.y - B.y)) / d,
        ((A.x * A.x + A.y * A.y) * (C.x - B.x) + (B.x * B.x + B.y * B.y) * (A.x - C.x) + (C.x * C.x + C.y * C.y) * (B.x - A.x)) / d
    );
    return new Circle(middle, radius);

}
export function welzl(P: Vector[]): Circle | undefined {
    if (P.length == 2) {
        const t: [Vector, Vector] = [P[0], P[1]];
        return trivial(t);
    }
    if (P.length == 1) {
        const t: [Vector] = [P[0]];
        return trivial(t);
    }
    if (P.length == 0) {
        return trivial([]);
    }
    return welzlInternal(P, []);
}

function welzlInternal(P: Vector[], R: [] | [Vector] | [Vector, Vector] | [Vector, Vector, Vector]): Circle | undefined {
    if (P.length == 0 || R.length == 3) {
        return trivial(R);
    }

    const [p, ...P2] = P;
    const D = welzlInternal(P2, R);
    if (D?.Contains(p) ?? false) {
        return D;
    }

    return welzlInternal(P2, [p, ...R])

}