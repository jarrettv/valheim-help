
export default function PenaltyNode({ imgsrc, score }: { imgsrc: string, score: number }) {
  return (
    <div className="trophy-node penalty" style={{ backgroundImage: `url(${imgsrc})` }}>
      <div>
        {score}
      </div>
    </div>);
}