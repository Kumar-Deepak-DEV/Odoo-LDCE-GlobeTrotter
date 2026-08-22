import { useState, useMemo, useEffect, useCallback } from 'react';
import type { FC, FormEvent } from 'react';
import {
  Search,
  PlusCircle,
  Heart,
  MessageSquare,
  Share2,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Luggage,
  Mountain,
  Send,
  X,
  Check,
  Image as ImageIcon,
} from 'lucide-react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { communityApi } from '../../api/communityApi';
import { useAuth } from '../../context/AuthContext';

interface PostComment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  time: string;
}

interface CommunityPostItem {
  id: string;
  author: string;
  avatar: string;
  timeAgo: string;
  tripBadge: {
    icon: string;
    label: string;
  };
  title: string;
  content: string;
  image?: string;
  likes: number;
  commentsCount: number;
  shares: number;
  comments: PostComment[];
}

const INITIAL_POSTS: CommunityPostItem[] = [
  {
    id: 'post-1',
    author: 'Sarah Jenkins',
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    timeAgo: '2 hours ago',
    tripBadge: {
      icon: 'luggage',
      label: 'European Highlights',
    },
    title: "Hidden coffee spots in Prague you can't miss!",
    content:
      'Spent the morning wandering through the cobblestone alleys of Malá Strana and stumbled upon the most incredible courtyard cafe. If you\'re visiting soon, definitely check out the place near the canal—the honey cake is life-changing! ☕🇨🇿',
    image:
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200&auto=format&fit=crop&q=80',
    likes: 124,
    commentsCount: 18,
    shares: 7,
    comments: [
      {
        id: 'c1',
        author: 'Marcus Chen',
        avatar:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        text: 'Adding this to my saved itinerary right now! What was the exact name?',
        time: '1 hour ago',
      },
      {
        id: 'c2',
        author: 'Elena Rostova',
        avatar:
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        text: 'Prague in autumn is so magical! Loved your photo.',
        time: '45 mins ago',
      },
    ],
  },
  {
    id: 'post-2',
    author: 'Marcus Chen',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    timeAgo: '5 hours ago',
    tripBadge: {
      icon: 'mountain',
      label: 'Swiss Alps Adventure',
    },
    title: 'First time paragliding in Interlaken!',
    content:
      'There are no words to describe the feeling of floating above Lake Brienz with the Jungfrau peak in the background. If you\'re even slightly considering it—DO IT. The instructors were amazing and the views are literal therapy. 🪂🏔️',
    likes: 89,
    commentsCount: 12,
    shares: 4,
    comments: [
      {
        id: 'c3',
        author: 'Alex Thompson',
        avatar:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        text: 'Did you need to book weeks in advance or is walk-in fine?',
        time: '3 hours ago',
      },
    ],
  },
  {
    id: 'post-3',
    author: 'Elena Rostova',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    timeAgo: '1 day ago',
    tripBadge: {
      icon: 'luggage',
      label: 'Kyoto Autumn',
    },
    title: 'Sunrise at Arashiyama Bamboo Grove 🎋',
    content:
      'Getting there at 6:00 AM before the tour groups arrive is the secret. The sound of bamboo stalks swaying gently in the morning breeze is something you will remember forever.',
    image:
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&auto=format&fit=crop&q=80',
    likes: 215,
    commentsCount: 34,
    shares: 19,
    comments: [],
  },
];

export const CommunityPage: FC = () => {
  const { user } = useAuth();
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState<CommunityPostItem[]>(INITIAL_POSTS);
  const [currentPage, setCurrentPage] = useState(1);

  // Load community posts from backend
  const loadPosts = useCallback(async () => {
    try {
      const res = await communityApi.getCommunityPosts({ limit: 20 });
      if (res?.posts && res.posts.length > 0) {
        const formatted: CommunityPostItem[] = res.posts.map((p) => ({
          id: p.id,
          author: p.user ? `${p.user.firstName} ${p.user.lastName}` : 'Traveler',
          avatar: p.user?.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          timeAgo: new Date(p.createdAt).toLocaleDateString(),
          tripBadge: {
            icon: 'luggage',
            label: p.trip?.name || 'Adventure',
          },
          title: p.title,
          content: p.content,
          image: p.imageUrl || p.trip?.coverPhotoUrl || undefined,
          likes: 12,
          commentsCount: 2,
          shares: 1,
          comments: [],
        }));
        setPosts(formatted);
      }
    } catch {
      // Keep defaults
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  // Engagement States
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Record<string, boolean>>({});
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [newCommentText, setNewCommentText] = useState('');

  // Share Your Trip Modal State
  const [showShareTripModal, setShowShareTripModal] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostTripBadge, setNewPostTripBadge] = useState('European Adventure');
  const [newPostImageUrl, setNewPostImageUrl] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filtered Posts
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const q = searchQuery.toLowerCase();
      return (
        post.title.toLowerCase().includes(q) ||
        post.content.toLowerCase().includes(q) ||
        post.author.toLowerCase().includes(q) ||
        post.tripBadge.label.toLowerCase().includes(q)
      );
    });
  }, [posts, searchQuery]);

  const toggleLike = (postId: string) => {
    setLikedPosts((prev) => {
      const isLiked = !prev[postId];
      setPosts((prevPosts) =>
        prevPosts.map((p) => {
          if (p.id === postId) {
            return {
              ...p,
              likes: isLiked ? p.likes + 1 : p.likes - 1,
            };
          }
          return p;
        })
      );
      return { ...prev, [postId]: isLiked };
    });
  };

  const toggleBookmark = (postId: string) => {
    setBookmarkedPosts((prev) => {
      const isBookmarked = !prev[postId];
      setToastMessage(
        isBookmarked
          ? 'Saved story to your bookmarks!'
          : 'Removed story from bookmarks.'
      );
      setTimeout(() => setToastMessage(null), 2500);
      return { ...prev, [postId]: isBookmarked };
    });
  };

  const handleSharePost = (postTitle: string) => {
    navigator.clipboard.writeText(window.location.href);
    setToastMessage(`Copied link to "${postTitle}"!`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleAddComment = (postId: string, e: FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComment: PostComment = {
      id: `comm_${Date.now()}`,
      author: user ? `${user.firstName} ${user.lastName}` : 'Alex Thompson',
      avatar:
        user?.photoUrl ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      text: newCommentText.trim(),
      time: 'Just now',
    };

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            commentsCount: p.commentsCount + 1,
            comments: [...p.comments, newComment],
          };
        }
        return p;
      })
    );

    setNewCommentText('');
  };

  const handleCreatePostSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostContent.trim()) return;

    let newPostId = `post_${Date.now()}`;
    try {
      const res = await communityApi.createCommunityPost({
        title: newPostTitle.trim(),
        content: newPostContent.trim(),
        imageUrl: newPostImageUrl.trim() || undefined,
      });
      if (res?.post) {
        newPostId = res.post.id;
      }
    } catch {
      // Handled locally
    }

    const createdPost: CommunityPostItem = {
      id: newPostId,
      author: user ? `${user.firstName} ${user.lastName}` : 'Alex Thompson',
      avatar:
        user?.photoUrl ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      timeAgo: 'Just now',
      tripBadge: {
        icon: 'luggage',
        label: newPostTripBadge,
      },
      title: newPostTitle.trim(),
      content: newPostContent.trim(),
      image: newPostImageUrl.trim() || undefined,
      likes: 1,
      commentsCount: 0,
      shares: 0,
      comments: [],
    };

    setPosts([createdPost, ...posts]);
    setShowShareTripModal(false);
    setNewPostTitle('');
    setNewPostContent('');
    setNewPostImageUrl('');
    setToastMessage('Your travel story was shared with the community!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const renderBadgeIcon = (type: string) => {
    if (type === 'mountain') {
      return <Mountain className="w-3.5 h-3.5 text-blue-600" />;
    }
    return <Luggage className="w-3.5 h-3.5 text-blue-600" />;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-body flex flex-col selection:bg-blue-500 selection:text-white">
      {/* Global Header */}
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
        {/* TOP CONTROLS BAR: SEARCH & SHARE YOUR TRIP BUTTON */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="relative w-full flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search community posts..."
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200/90 rounded-2xl text-sm outline-none transition-all shadow-xs focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Share Your Trip Button */}
          <button
            type="button"
            onClick={() => setShowShareTripModal(true)}
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <PlusCircle className="w-4 h-4 stroke-[2.5]" />
            <span>Share your trip</span>
          </button>
        </div>

        {/* FEEDBACK TOAST */}
        {toastMessage && (
          <div className="p-3.5 bg-slate-900 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-xl animate-fadeIn max-w-md mx-auto">
            <Check className="w-4 h-4 text-teal-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* COMMUNITY POSTS FEED */}
        <div className="space-y-6">
          {filteredPosts.map((post) => {
            const isLiked = !!likedPosts[post.id];
            const isBookmarked = !!bookmarkedPosts[post.id];
            const isCommentsOpen = activeCommentPostId === post.id;

            return (
              <article
                key={post.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-4 hover:shadow-md transition-all"
              >
                {/* Post Author & Trip Badge Header */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={post.avatar}
                      alt={post.author}
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-slate-100 shadow-2xs"
                    />
                    <div>
                      <h3 className="font-heading font-bold text-base text-slate-900 leading-tight">
                        {post.author}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5 font-normal">
                        {post.timeAgo}
                      </p>
                    </div>
                  </div>

                  {/* Linked Trip Badge */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold shadow-2xs">
                    {renderBadgeIcon(post.tripBadge.icon)}
                    <span>{post.tripBadge.label}</span>
                  </div>
                </div>

                {/* Post Title & Content */}
                <div className="space-y-2 pt-1">
                  <h2 className="text-lg sm:text-xl font-bold font-heading text-slate-900 tracking-tight leading-snug">
                    {post.title}
                  </h2>
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
                    {post.content}
                  </p>
                </div>

                {/* Post Image Media if available */}
                {post.image && (
                  <div className="rounded-2xl overflow-hidden aspect-[2.1/1] sm:aspect-[2.3/1] bg-slate-100">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-500 ease-out"
                    />
                  </div>
                )}

                {/* Post Engagement Bar */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs font-semibold">
                  {/* Left Engagement Metrics */}
                  <div className="flex items-center gap-6">
                    {/* Likes */}
                    <button
                      type="button"
                      onClick={() => toggleLike(post.id)}
                      className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                        isLiked
                          ? 'text-red-500 font-bold'
                          : 'text-orange-500 hover:text-red-600'
                      }`}
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          isLiked ? 'fill-red-500 text-red-500' : ''
                        }`}
                      />
                      <span>{post.likes}</span>
                    </button>

                    {/* Comments */}
                    <button
                      type="button"
                      onClick={() =>
                        setActiveCommentPostId(isCommentsOpen ? null : post.id)
                      }
                      className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>{post.commentsCount}</span>
                    </button>

                    {/* Shares */}
                    <button
                      type="button"
                      onClick={() => handleSharePost(post.title)}
                      className="flex items-center gap-1.5 text-teal-600 hover:text-teal-700 transition-colors cursor-pointer"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>{post.shares}</span>
                    </button>
                  </div>

                  {/* Right Bookmark Action */}
                  <button
                    type="button"
                    onClick={() => toggleBookmark(post.id)}
                    aria-label="Bookmark post"
                    className={`p-1.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer ${
                      isBookmarked
                        ? 'text-blue-600'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <Bookmark
                      className={`w-4 h-4 ${
                        isBookmarked ? 'fill-blue-600 text-blue-600' : ''
                      }`}
                    />
                  </button>
                </div>

                {/* Collapsible Comments Section */}
                {isCommentsOpen && (
                  <div className="pt-4 border-t border-slate-100 space-y-3 animate-fadeIn">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Comments ({post.comments.length})
                    </h4>

                    {/* Comments List */}
                    <div className="space-y-2.5">
                      {post.comments.map((comm) => (
                        <div
                          key={comm.id}
                          className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-100"
                        >
                          <img
                            src={comm.avatar}
                            alt={comm.author}
                            className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5"
                          />
                          <div className="flex-1 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-900">
                                {comm.author}
                              </span>
                              <span className="text-slate-400">{comm.time}</span>
                            </div>
                            <p className="text-slate-600 mt-1">{comm.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Add Comment Input */}
                    <form
                      onSubmit={(e) => handleAddComment(post.id, e)}
                      className="flex gap-2 pt-2"
                    >
                      <input
                        type="text"
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                        placeholder="Write a comment..."
                        className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 flex items-center gap-1"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Reply</span>
                      </button>
                    </form>
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {/* PAGINATION CONTROLS */}
        <div className="flex items-center justify-center gap-2 pt-6">
          <button
            type="button"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {[1, 2, 3].map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => setCurrentPage(page)}
              className={`w-9 h-9 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                currentPage === page
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            type="button"
            onClick={() => setCurrentPage(Math.min(3, currentPage + 1))}
            disabled={currentPage === 3}
            className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </main>

      {/* MODAL: SHARE YOUR TRIP STORY */}
      {showShareTripModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-bold font-heading text-slate-900">
                Share Your Travel Story
              </h3>
              <button
                type="button"
                onClick={() => setShowShareTripModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePostSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Story Title *
                </label>
                <input
                  type="text"
                  required
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  placeholder="e.g. 5 hidden gems in Kyoto"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Linked Trip / Badge
                </label>
                <select
                  value={newPostTripBadge}
                  onChange={(e) => setNewPostTripBadge(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 bg-white"
                >
                  <option value="European Adventure">European Adventure</option>
                  <option value="Swiss Alps Adventure">Swiss Alps Adventure</option>
                  <option value="Aegean Odyssey">Aegean Odyssey</option>
                  <option value="PNW Roadtrip">PNW Roadtrip</option>
                  <option value="Kyoto Autumn">Kyoto Autumn</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Story & Experiences *
                </label>
                <textarea
                  rows={4}
                  required
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="Share highlights, tips, recommendations for fellow travelers..."
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Photo URL (Optional)
                </label>
                <div className="relative">
                  <ImageIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    value={newPostImageUrl}
                    onChange={(e) => setNewPostImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowShareTripModal(false)}
                  className="flex-1 py-2.5 border border-slate-300 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700"
                >
                  Publish Story
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Global Footer */}
      <Footer />
    </div>
  );
};

export default CommunityPage;
