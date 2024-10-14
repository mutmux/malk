let dataEncoded = '';  // hexadecimal representation of savegame for reading/writing

const offsets = [
	{
		"offsetStart": 0x1,
		"offsetEnd": 0x2,
		"desc": "timestamp year"
	},
	{
		"offsetStart": 0x4,
		"offsetEnd": 0x4,
		"desc": "timestamp month"
	},
	{
		"offsetStart": 0x5,
		"offsetEnd": 0x5,
		"desc": "timestamp day"
	},
	{
		"offsetStart": 0x6,
		"offsetEnd": 0x6,
		"desc": "timestamp hour"
	},
	{
		"offsetStart": 0x7,
		"offsetEnd": 0x7,
		"desc": "timestamp minute"
	},
	{
		"offsetStart": 0x8,
		"offsetEnd": 0x8,
		"desc": "timestamp second"
	},
	{
		"offsetStart": 0xA,
		"offsetEnd": 0xA,
		"desc": "display level"
	},
	{
		"offsetStart": 0xB,
		"offsetEnd": 0xB,
		"desc": "display mission"
	},
	{
		"offsetStart": 0x259,
		"offsetEnd": 0x259,
		"desc": "total gags found"
	},
	{
		"offsetStart": 0x1115,
		"offsetEnd": 0x1115,
		"desc": "last level played"
	},
	{
		"offsetStart": 0x1119,
		"offsetEnd": 0x1119,
		"desc": "last mission"
	},
	{
		"offsetStart": 0x111D,
		"offsetEnd": 0x111D,
		"desc": "last level unlocked"
	},
	{
		"offsetStart": 0x1129,
		"offsetEnd": 0x112B,
		"desc": "coins count"
	}
];