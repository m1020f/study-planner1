export default function TaskList({ tasks }: any) {
  return (
    <ul className="space-y-3">
      {tasks.map((task: any) => (
        <li key={task.id} className="border rounded p-3 flex justify-between">
          <div>
            <div className="font-medium">{task.title}</div>
            <div className="text-sm text-gray-500">
              {new Date(task.scheduledDate).toLocaleDateString()}
            </div>
          </div>
          <span className="text-xs border px-2 py-1 rounded">
            {task.status}
          </span>
        </li>
      ))}
    </ul>
  );
}
