

<h1>Employee Information:</h1>


<div style="color: red; font-weight: bold;">{message}</div>
<BR>

<form action="/changeEmployee" method="post">
<input type="hidden" name="id" value="{id}">
<input type="hidden" name="type" value="edit">

<table>
<tr>
<td>Name:</td>
<td><input type="text" size="20" name="name" value="{name}"></td>
</tr>

<tr>
<td>Social:</td>
<td><input type="text" size="20" name="social" value="{social}"></td>
</tr>

<tr>
<td>Phone:</td>
<td><input type="text" size="20" name="phone" value="{phone}"></td>
</tr>

<tr>
<td>DOB:</td>
<td><input type="text" size="20" name="dob" value="{dob}"></td>
</tr>

</table>

<BR>

<table><tr><td valign="top">
<input type="submit" value=" SAVE CHANGES ">
</form>
</td>
<td>
&nbsp;&nbsp;&nbsp;&nbsp;
</td>
<td valign="top">
<form action="/deleteEmployee" method="get">
<input type="hidden" name="id" value="{id}">
<input type="submit" value=" DELETE EMPLOYEE ">
</form>
</td>

<td>
&nbsp;&nbsp;&nbsp;&nbsp;
</td>
<td valign="top">
<form action="/showEmployees" method="get">
<input type="submit" value=" EMPLOYEE LIST ">
</form>
</td>

</tr></table>
<BR><BR>



