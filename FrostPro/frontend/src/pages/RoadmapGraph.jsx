import { useState, useCallback } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState
} from 'reactflow';
import 'reactflow/dist/style.css';

// Custom node for roadmap items
const RoadmapNode = ({ data }) => {
  const statusColors = {
    'completed': 'bg-green-200 border-green-500',
    'in-progress': 'bg-yellow-200 border-yellow-500',
    'not-started': 'bg-gray-200 border-gray-500'
  };

  const levelColors = {
    1: 'bg-blue-100',
    2: 'bg-purple-100',
    3: 'bg-pink-100'
  };

  return (
    <div className={`p-4 rounded-lg shadow-md border-2 w-64 ${statusColors[data.status]}`}>
      <div className={`absolute top-0 right-0 text-xs px-2 py-1 rounded-bl-lg ${levelColors[data.level]}`}>
        Level {data.level}
      </div>
      <h3 className="font-bold text-lg">{data.title}</h3>
      <p className="text-sm mt-2">{data.description}</p>
      
      <div className="flex mt-3 gap-2">
        <select 
          className="text-xs border rounded p-1" 
          value={data.status}
          onChange={(e) => data.onStatusChange(data.id, e.target.value)}
        >
          <option value="not-started">Not Started</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <button 
          className="text-xs bg-blue-500 text-white px-2 py-1 rounded"
          onClick={() => data.onEdit(data.id)}
        >
          Edit
        </button>
      </div>
    </div>
  );
};

const nodeTypes = { roadmapNode: RoadmapNode };

const RoadmapGraph = ({ roadmap, onUpdateRoadmap }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Initialize flow when roadmap changes
  useState(() => {
    if (!roadmap || !roadmap.nodes) return;
    
    // Create nodes
    const flowNodes = roadmap.nodes.map(node => ({
      id: node.id,
      type: 'roadmapNode',
      data: { 
        ...node,
        onStatusChange: handleStatusChange,
        onEdit: handleEditNode
      },
      position: calculateNodePosition(node)
    }));
    
    // Create edges from prerequisites
    const flowEdges = [];
    roadmap.nodes.forEach(node => {
      if (node.prerequisites && node.prerequisites.length > 0) {
        node.prerequisites.forEach(prereqId => {
          flowEdges.push({
            id: `e${prereqId}-${node.id}`,
            source: prereqId,
            target: node.id,
            animated: true,
            style: { stroke: '#999' }
          });
        });
      }
    });
    
    setNodes(flowNodes);
    setEdges(flowEdges);
  }, [roadmap]);

  // Calculate node positions based on level and position in level
  const calculateNodePosition = (node) => {
    const levelSpacing = 300;
    const nodeSpacing = 200;
    
    // Get all nodes in this level
    const nodesInLevel = roadmap.nodes.filter(n => n.level === node.level);
    const indexInLevel = nodesInLevel.findIndex(n => n.id === node.id);
    
    // Calculate position
    const x = (node.level - 1) * levelSpacing;
    const y = indexInLevel * nodeSpacing;
    
    return { x, y };
  };

  const handleStatusChange = (nodeId, newStatus) => {
    const updatedRoadmap = {
      ...roadmap,
      nodes: roadmap.nodes.map(node => 
        node.id === nodeId ? { ...node, status: newStatus } : node
      )
    };
    
    onUpdateRoadmap(updatedRoadmap);
  };

  const handleEditNode = (nodeId) => {
    const nodeToEdit = roadmap.nodes.find(node => node.id === nodeId);
    setSelectedNode(nodeToEdit);
    setIsEditing(true);
  };

  const handleSaveEdit = (editedNode) => {
    const updatedRoadmap = {
      ...roadmap,
      nodes: roadmap.nodes.map(node => 
        node.id === editedNode.id ? editedNode : node
      )
    };
    
    onUpdateRoadmap(updatedRoadmap);
    setIsEditing(false);
    setSelectedNode(null);
  };

  const onConnect = useCallback((params) => {
    // Update the edges in the flow
    setEdges((eds) => addEdge({ ...params, animated: true }, eds));
    
    // Update the prerequisites in the roadmap data
    const targetNodeId = params.target;
    const sourceNodeId = params.source;
    
    const updatedRoadmap = {
      ...roadmap,
      nodes: roadmap.nodes.map(node => {
        if (node.id === targetNodeId) {
          const prerequisites = node.prerequisites || [];
          if (!prerequisites.includes(sourceNodeId)) {
            return {
              ...node,
              prerequisites: [...prerequisites, sourceNodeId]
            };
          }
        }
        return node;
      })
    };
    
    onUpdateRoadmap(updatedRoadmap);
  }, [roadmap, onUpdateRoadmap]);

  return (
    <div className="h-screen">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
      
      {isEditing && selectedNode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-bold mb-4">Edit Node</h3>
            <EditNodeForm node={selectedNode} onSave={handleSaveEdit} onCancel={() => setIsEditing(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

const EditNodeForm = ({ node, onSave, onCancel }) => {
  const [editedNode, setEditedNode] = useState({ ...node });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedNode(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editedNode);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          type="text"
          name="title"
          value={editedNode.title}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          name="description"
          value={editedNode.description}
          onChange={handleChange}
          className="w-full p-2 border rounded h-24"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Level</label>
        <select
          name="level"
          value={editedNode.level}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value={1}>Level 1</option>
          <option value={2}>Level 2</option>
          <option value={3}>Level 3</option>
        </select>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Status</label>
        <select
          name="status"
          value={editedNode.status}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="not-started">Not Started</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      
      <div className="flex justify-end gap-2">
        <button 
          type="button" 
          onClick={onCancel}
          className="px-4 py-2 border rounded"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default RoadmapGraph;