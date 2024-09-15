
export default function TrophyNode({ imgsrc, score }: { imgsrc: string, score: number }) {
  return (
    <div className="trophy-node" style={{ backgroundImage: `url(${imgsrc})` }}>
      <div>
        {score}
      </div>
    </div>);
}