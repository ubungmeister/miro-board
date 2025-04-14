import { BoardsList } from '@/app/components/dashboard/BoardsList';
import { BoardForm } from '../components/dashboard/BoardForm';

const Dashboard = () => {
  return (
    <div>
      <h1>Dashboard</h1>
      <BoardsList />
      <BoardForm />
    </div>
  );
};

export default Dashboard;
