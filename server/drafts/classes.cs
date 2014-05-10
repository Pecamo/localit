public class User {
	public int id {get; set;}						// Unique user id (primary key)
	public int googleUserId {get; set;}				// Google id of user
	public int facebookUserId {get; set;}			// Facebook id of user
	public String displayName {get; set;}			// Name to be displayed
	public String displayAvatarLink {get; set;}		// Link to user's avatar
}

public class Message {
	public int id {get; set;}						// Unique message id (primary key)
	public int author {get; set;}					// id of the user who wrote the post (foreign key)
	public String content {get; set;}				// Content of the message
	public Tuple<float, float> location {get; set;}	// Location from where the post was sent
	public DateTime sentTime {get; set;}			// Date+Time at which the message was sent
	public String title	{get; set;}					// Title of the message (that will be displayed in the topic list)
	public int parent {get; set;}					// id of the parent message, if this message is in answer
}

public class Vote {
	public int userId {get; set;}					// id of the user that upvotes (foreign key)
	public int MessageId {get; set;}				// id of the messages being upvoted (foreign key)
}